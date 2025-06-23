"""
HERE (app.state.vector_store,app.state.chat_id,app.state.username) IS USED BEAWARE TO CHANGE IT AS FOR NOW ONLY ONE USER IS USING FOR DEVELOPMENT PURPOSE
BUT IF THERE ARE MULTIPLE UESRS THEN THERE IS HIGH PROBABILITY THEIR FILES MAY COLLIDE AND OVERWRITE EACH OTHER
LIKE IF THEY BOTH UPLOAD PDF WITH SAME NAME THEN THEIR DATA WILL BE INTERCHANGED
THROUGH FORNTEND SEND THESE PARAMETER(app.state.vector_store,app.state.chat_id,app.state.username) TO CHAT PAGE
"""

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Body, WebSocket
from fastapi import UploadFile, File
from langchain_community.document_loaders import PyMuPDFLoader
import fitz
from embeddings_vectordb import process, process_multiple
from generation_retrival import gen_ret
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware
from langchain.schema import Document
from schema import QueryRequest
from schema import User
from storage.database import crud
from hashing.password_hashing import hashing
from authentication.auth import auth_router
from authentication.auth import get_user_history, get_username
from typing import Annotated, List
import uuid
from gridfs_db.create_db_pdf import create_pdf
from gridfs_db.get_file_data import get_file_data
import json
import pickle
import datetime

app = FastAPI()
router = APIRouter()

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {"res": "You have reached home"}


@app.post("/signup")
async def signup(user: User):
    hashed_password = hashing(user.password)
    if hashed_password == "password_error":
        raise HTTPException(status_code=400, detail="Missing password")
    else:
        crud.insert_one({"username": user.username, "password": hashed_password})
        print("insert user")


app.include_router(auth_router)


@app.get("/user_history")
async def user_history(username: Annotated[str, Depends(get_username)], fileid: str):

    file_bytes = get_file_data(fileid)
    app.state.is_multiple = True
    app.state.vector_store = pickle.loads(file_bytes.read())
    app.state.chat_id = fileid
    app.state.username = username
    return {"context": "Done"}


@app.get("/user_pdfs")
async def get_pdfs(username: Annotated[str, Depends(get_username)],is_multiple_frontend: bool = False):
    if is_multiple_frontend:
        userpdf_obj = crud.get_user_pdfs_multiple(username)
        return {"userpdf_obj": userpdf_obj}
    else:
        userpdf_obj = crud.get_user_pdfs(username)
        return {"userpdf_obj": userpdf_obj}


@app.post("/upload")
async def pdf_processing(
    username: Annotated[str, Depends(get_username)], file: UploadFile = File(...)
):
    def generate_chatid():
        return str(uuid.uuid4())

    pdf_name = file.filename
    pdf_data = {"name": pdf_name, "context": []}
    chat_id = generate_chatid()
    crud.create_context_field(username, chat_id, pdf_data)
    app.state.chat_id = chat_id
    app.state.username = username

    temp_file_path = f"D:/RAG2/data/{file.filename}_copy.pdf"

    print("endpoint reached")
    with open(temp_file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        loader = PyMuPDFLoader(temp_file_path)
        docs = loader.load()
        vector_store = process(docs)
        pdf_binary_id = create_pdf(vector_store, chat_id)
        app.state.vector_store = vector_store
        return {"res": "Done processing PDF"}
    except Exception as e:
        return {"res": f"Error :{e}"}
    finally:
        os.remove(temp_file_path)


@app.post("/multiple")
async def multiple_pdf_processing(username: Annotated[str, Depends(get_username)],files: List[UploadFile] = File(...)):
    #Check for connection 
    print("multiple")

    def generate_chatid():
        return str(uuid.uuid4())

    chat_id = generate_chatid()
    data_today = datetime.date.today()
    pdf_data = {"name": f"Chat from {data_today.strftime('%b %d, %Y')}", "context": []}
    crud.create_context_field_multiple(username, chat_id, pdf_data)
    app.state.chat_id = chat_id
    app.state.username = username
    app.state.is_multiple = True

    try:
        filepath_arr = []
        for file in files:
            filename_wo_ext, ext = os.path.splitext(file.filename)
            temp_filepath = f"D:/RAG2/data/{filename_wo_ext}_copy{ext}"
            with open(temp_filepath, "wb") as f:
                shutil.copyfileobj(file.file, f)
            filepath_arr.append(temp_filepath)
        vector_store = process_multiple(filepath_arr)

        #Storing vector store to database
        pdf_binary_id = create_pdf(vector_store, chat_id)

        app.state.vector_store = vector_store
        return {"res": f"{filepath_arr[0]}"}
    except Exception as e:
        print(e)
        return {"res": str(e)}
    finally:
        for path in filepath_arr:
            os.remove(path)


# Maybe later on make this endpoint token dependent too
@app.websocket("/query")
async def query_to_bot(webSocket: WebSocket):
    vector_store = app.state.vector_store
    chat_id = app.state.chat_id
    username = app.state.username
    is_multiple = getattr(app.state, "is_multiple", False)
    print(is_multiple)
    await webSocket.accept()
    while True:
        raw_text = await webSocket.receive_text()
        # query_dict = json.loads(raw_text)
        if is_multiple:
            for chunck in gen_ret(
                raw_text, vector_store=vector_store, uuid=chat_id, username=username,is_multiple=True
            ):
                await webSocket.send_text(chunck)
        else:
            for chunck in gen_ret(
                raw_text, vector_store=vector_store, uuid=chat_id, username=username
            ):
                await webSocket.send_text(chunck)

app.include_router(router)
