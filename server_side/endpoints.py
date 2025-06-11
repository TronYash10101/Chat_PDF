from fastapi import FastAPI,APIRouter,HTTPException,Depends,Body
from fastapi import UploadFile
from langchain_community.document_loaders import PyMuPDFLoader
from embeddings_vectordb import process
from generation_retrival import gen_ret
import shutil
import os
from datetime import datetime, date, timedelta
from fastapi.middleware.cors import CORSMiddleware
from schema import QueryRequest
from schema import User
from storage.database import crud
# import storage.db_collections
from hashing.password_hashing import hashing
from authentication.auth import auth_router
from authentication.auth import get_user_history,get_username
from typing import Annotated

app = FastAPI()
router = APIRouter()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"res" : "You have reached home"}

@app.post("/signup")
async def signup(user : User):
    hashed_password = hashing(user.password)
    if(hashed_password == "password_error"):
        raise HTTPException(status_code=400, detail="Missing password")
    else:
        crud.insert_one({"username":user.username,"password" : hashed_password})
        print("insert user")

app.include_router(auth_router)
@app.get("/user_history")
async def user_history(context : Annotated[str,Depends(get_user_history)]):
    return {"context" : context}


@app.post("/upload")
async def pdf_processing(file : UploadFile, username : Annotated[str,Depends(get_username)]):
    pdf_name = file.filename
    crud.create_context_field(username,pdf_name)

    temp_file_path = f"D:/RAG2/data/{file.filename}_copy.pdf"

    print("endpoint reached")
    with open(temp_file_path , "wb") as f:
        shutil.copyfileobj(file.file, f)
    try:
        loader = PyMuPDFLoader(temp_file_path)
        docs = loader.load()
        vector_store = process(docs)
        app.state.vector_store = vector_store
        return {"res" : "Done processing PDF"}
    except Exception as e:
        return {"res" : f"Error :{e}"}
    finally:
        os.remove(temp_file_path)

@app.post("/query")
async def query_to_bot(query: QueryRequest):
     vector_store = app.state.vector_store 
     ai_res = gen_ret(query,vector_store)
     return {"ai_res" : ai_res}

app.include_router(router)