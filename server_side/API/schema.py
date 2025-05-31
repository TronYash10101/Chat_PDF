from pydantic import BaseModel
from typing import List,Union

class QueryRequest(BaseModel):
    query: str

class User(BaseModel):
    user : str
    password : str