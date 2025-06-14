import gridfs
from storage.db_collections import database

db =database
fs = gridfs.GridFS(db)

def get_file_data(filename_in_db):
    file_data = fs.find_one({"filename": filename_in_db})
    return file_data