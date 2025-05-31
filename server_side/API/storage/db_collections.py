from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

database = client["train_db"]

user_collection = database["users"]

