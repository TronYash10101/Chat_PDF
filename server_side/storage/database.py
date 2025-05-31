from storage.db_collections import user_collection

# def temp_add():
#     arr = []
#     for x in range(2):

#         user = input("enter username: ")
#         password = input("enter password: ")

#         user_dict = {"user": user, "password": password}

#         arr.append(user_dict)

class crud:
    def insert_one(user_dict : dict):
        result = user_collection.insert_one(user_dict)

