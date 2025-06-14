'''
HERE (app.state.vector_store,app.state.chat_id,app.state.username) IS USED BEAWARE TO CHANGE IT AS FOR NOW ONLY ONE USER IS USING FOR DEVELOPMENT PURPOSE
BUT IF THERE ARE MULTIPLE UESRS THEN THERE IS HIGH PROBABILITY THEIR FILES MAY COLLIDE AND OVERWRITE EACH OTHER
LIKE IF THEY BOTH UPLOAD PDF WITH SAME NAME THEN THEIR DATA WILL BE INTERCHANGED 
THROUGH FORNTEND SEND THESE PARAMETER(app.state.vector_store,app.state.chat_id,app.state.username) TO CHAT PAGE
'''
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Body
from fastapi import UploadFile
from langchain_community.document_loaders import PyMuPDFLoader
import fitz
from embeddings_vectordb import process
from generation_retrival import gen_ret
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware
from langchain.schema import Document
from schema import QueryRequest
from schema import User
from storage.database import crud
# import storage.db_collections
from hashing.password_hashing import hashing
from authentication.auth import auth_router
from authentication.auth import get_user_history, get_username
from typing import Annotated
import uuid
from gridfs_db.create_db_pdf import create_pdf
from gridfs_db.get_file_data import get_file_data


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
async def user_history(username : Annotated[str,Depends(get_username)],fileid:str):

    file_bytes = get_file_data(fileid)
    file_data = file_bytes.read()
    loader = fitz.open(stream=file_data,filetype="pdf")
    docs = []
    for page_num in range(len(loader)):
        page = loader.load_page(page_num)
        text_page = page.get_textpage()
        text = text_page.extractText()
        docs.append(Document(page_content=text))
    vector_store = process(docs)
    app.state.vector_store = vector_store
    app.state.chat_id = fileid
    app.state.username = username
    return {"context": "Done"}


@app.get("/user_pdfs")
async def get_pdfs(username: Annotated[str, Depends(get_username)]):
    userpdf_obj = crud.get_user_pdfs(username)
    return {"userpdf_obj": userpdf_obj}


@app.post("/upload")
async def pdf_processing(
    file: UploadFile, username: Annotated[str, Depends(get_username)]
):
    def generate_chatid():
        return str(uuid.uuid4())
    pdf_name = file.filename
    pdf_data = {"name": pdf_name, "context": []}
    chat_id = generate_chatid()
    crud.create_context_field(username,chat_id , pdf_data)
    app.state.chat_id = chat_id
    app.state.username = username


    temp_file_path = f"D:/RAG2/data/{file.filename}_copy.pdf"

    print("endpoint reached")
    with open(temp_file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    pdf_binary_id = create_pdf(temp_file_path,chat_id)
    
    try:
        loader = PyMuPDFLoader(temp_file_path)
        docs = loader.load()
        vector_store = process(docs)
        app.state.vector_store = vector_store
        return {"res": "Done processing PDF"}
    except Exception as e:
        return {"res": f"Error :{e}"}
    finally:
        os.remove(temp_file_path)

#Maybe later on make this endpoint token dependent too
@app.post("/query")
async def query_to_bot(query: QueryRequest):
    vector_store = app.state.vector_store
    chat_id = app.state.chat_id
    username = app.state.username
    ai_res = gen_ret(query, vector_store,chat_id,username)
    return {"ai_res": ai_res}


app.include_router(router)
