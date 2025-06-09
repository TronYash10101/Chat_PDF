from pydantic import BaseModel
from typing import List,Union

class QueryRequest(BaseModel):
    query: str

class User(BaseModel):
    username : str
    password : str

class Token(BaseModel):
    access_token: str
    token_type: str