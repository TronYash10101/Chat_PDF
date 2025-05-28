from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
import faiss


# load_dotenv()
# api_key = os.getenv()
# loader = PyMuPDFLoader("D:\RAG2\data\pdf.pdf")
# docs = loader.load()

def process(docs):
    text_split = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True,
        )

    all_splits = text_split.split_documents(docs)

    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

    embedding_length = len(embedding_model.embed_query(all_splits[3].page_content))

    index = faiss.IndexFlatL2(embedding_length)

    vector_store = FAISS(
            embedding_function=embedding_model,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

    ids = vector_store.add_documents(documents=all_splits)

    return vector_store



