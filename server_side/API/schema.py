from pydantic import BaseModel
from typing import List,Union

class QueryRequest(BaseModel):
    query: str

class User(BaseModel):
    user : str
    context : str
    password : str