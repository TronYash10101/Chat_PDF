from pymongo import MongoClient
import schema 

user_instance = schema.User({
    
})

client = MongoClient('mongodb://localhost:27017/')

database = client["train_db"]
collection = database["users"]


# result = collection.insert_many(
#  [{}]
# )

# for x in range(1, 11):
    