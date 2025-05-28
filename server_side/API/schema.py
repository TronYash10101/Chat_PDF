from pydantic import BaseModel
from typing import List,Union

class QueryRequest(BaseModel):
    query: str
