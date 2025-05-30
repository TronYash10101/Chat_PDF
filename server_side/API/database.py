from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

database = client["train_db"]
collection = database["users"]
arr = []

for x in range(2):

    user = input("enter username: ")
    password = input("enter password: ")

    user_dict = {"user": user, "password": password}

    arr.append(user_dict)

result = collection.insert_many(arr)