import gridfs
from storage.db_collections import database

db =database
fs = gridfs.GridFS(db)

def create_pdf(pdf_path : str ,  fileid_in_db:str):
    with open(pdf_path,"rb") as f:
        file_id = fs.put(f,filename=fileid_in_db)
        print("Stored with file_id:", file_id)
        return file_id
