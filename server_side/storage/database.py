from storage.db_collections import user_collection
from typing import Annotated
from fastapi import Depends


class crud:
    def insert_one(user_dict: dict):
        result_insert = user_collection.insert_one(user_dict)

    def read(username: str):
        result_read = user_collection.find_one(filter={"username": username})
        return result_read

    def create_context_field(username: str, uid: str,pdf_data:str):
        # result_field = user_collection.update_one({"username" : username},{"$set" : {"pdf" :{pdf_name: ""}}})

        query = {"username": username, f"single_pdf.{uid}": {"$exists": False}}
        
        update = {"$set": {f"single_pdf.{uid}": pdf_data}}

        user_collection.update_one(query, update)

    def create_context_field_multiple(username: str, uid: str,pdf_data:str):
        query = {"username": username, f"multiple_pdf.{uid}": {"$exists": False}}
        
        update = {"$set": {f"multiple_pdf.{uid}": pdf_data}}

        user_collection.update_one(query, update)

    def get_user_pdfs(username:str):
        result = user_collection.find_one({"username": username}, {"single_pdf": 1, "_id": 0})
        return result.get("single_pdf")
    
    def get_user_pdfs_multiple(username:str):
        result = user_collection.find_one({"username": username}, {"multiple_pdf": 1, "_id": 0})
        return result.get("multiple_pdf")

    def update_context_field(username: str,uid: str,context:list):
         query = {"username": username, f"single_pdf.{uid}": {"$exists": True}}

         update = {"$set": {f"single_pdf.{uid}.context": context}}

         user_collection.update_one(query, update)
    
    def update_context_field_multiple(username: str,uid: str,context:list):
         query = {"username": username, f"multiple_pdf.{uid}": {"$exists": True}}

         update = {"$set": {f"multiple_pdf.{uid}.context": context}}

         user_collection.update_one(query, update)

    def get_user_context(username:str,uid:str):
        result = user_collection.find_one({"username": username}, {"single_pdf": 1, "_id": 0})
        return result.get("single_pdf")[uid].get("context")

    def get_user_context_multiple(username:str,uid:str):
        result = user_collection.find_one({"username": username}, {"multiple_pdf": 1, "_id": 0})
        return result.get("multiple_pdf")[uid].get("context")
    
