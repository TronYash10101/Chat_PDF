from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from jose import JWTError
from passlib.context import CryptContext
# from datetime import datetime, timedelt
from typing import Annotated
from fastapi import Depends, FastAPI
import sys
import os
import bcrypt
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import schema
from storage.database import crud


SECRET = ""
ALGORITHM = "HS256"
TOKEN_EXPIRE =30

app2 = FastAPI() #added temporarily remove afterwards 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#temp function to decode a token(jwt) will be replaced later, also to get user from database
def fake_token_decode():
    return schema.User(username="yash",password="pass")


async def get_user(token : Annotated[str,Depends(oauth2_scheme)]):
    user = fake_token_decode(token)
    return user

@app2.post("/token")
async def login(form_data : Annotated[OAuth2PasswordRequestForm,Depends()]):
##password entered was incorrect
    user_list = crud.read(form_data.username)
    password_hased_incoming_bytes = form_data.password.encode("utf-8")
    

    if not user_list:
        return {"error" : "no user found"}

    if not bcrypt.checkpw(password_hased_incoming_bytes,user_list["password"]):
        return {"error": "incorrct password"}

    return {"username" : user_list["username"]}

# @app.get("/users/me")
# async def read_users_me(
#     current_user: Annotated[schema.User, Depends(get_user)],
# ):
#     return current_user