from fastapi import FastAPI,APIRouter
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

@router.post("/signup")
async def signup(user : User):
    crud.insert_one({"name":user.user,"password" : user.password})
    
@router.post("/upload")
async def pdf_processing(file : UploadFile):
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

@router.post("/query")
async def query_to_bot(query : QueryRequest):
     vector_store = app.state.vector_store 
     ai_res = gen_ret(query,vector_store)
     return {"ai_res" : ai_res}

app.include_router(router)