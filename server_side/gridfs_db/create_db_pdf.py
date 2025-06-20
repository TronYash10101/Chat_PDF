import gridfs
import pickle
import os
from storage.db_collections import database
import io

db =database
fs = gridfs.GridFS(db)

def create_pdf(vector_store,fileid_in_db:str):
    try:
        #Store in RAM in form of bytes
        buffer = io.BytesIO()
        pickle.dump(vector_store,buffer)
        buffer.seek(0)
        
        #Access those bytes from RAM 
        file_id = fs.put(buffer,filename=fileid_in_db)
        print("Stored with file_id:", file_id)
        return file_id
    except Exception as e:
        print(e)
        return None

