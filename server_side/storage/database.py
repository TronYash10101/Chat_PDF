from storage.db_collections import user_collection
from typing import Annotated
from fastapi import Depends

class crud:
    def insert_one(user_dict: dict):
        result_insert = user_collection.insert_one(user_dict)

    def read(username : str):
        result_read = user_collection.find_one(filter={"username": username})
        return result_read

    def create_context_field(username:str,pdf_name : str):
        result_field = user_collection.update_one({"username" : username},{"$set" : {"pdf" :{pdf_name: ""}}})