import os
import ast
import pickle

File = os.path.join("data", "history.json")

with open(File, 'rb') as f:
        message_history = pickle.load(f)

print(message_history)

# s = "[3, 1, 2]"
# arr = ast.literal_eval(s)
# print(type(arr))