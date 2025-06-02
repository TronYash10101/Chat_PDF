from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from jose import JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Depends, FastAPI,HTTPException,status
import sys
import os
import bcrypt
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import jwt
from jwt.exceptions import InvalidTokenError
import schema
from storage.database import crud
from fastapi import APIRouter

SECRET = "0bb05e4d28d6c90b8d7a15b942b3e0053eb45f235fd466a00517a509e98d355b"
ALGORITHM = "HS256"
TOKEN_EXPIRE =30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
auth_router = APIRouter()

#temp function to decode a token(jwt) will be replaced later, also to get user from database
def user_history(token : Annotated[str,Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        jwt_decoded = jwt.decode(token,SECRET,algorithms=[ALGORITHM])
        username = jwt_decoded.get("sub")
        if not username:
            raise credentials_exception
        user_list = crud.read(username)
        user_history = user_list["history"]
        if not user_history:
            raise credentials_exception
    except:
        raise credentials_exception
    return user_history

def create_access_token(data : dict , expire_time: timedelta | None = None):
    to_encode = data.copy()
    if expire_time:
        expire = datetime.now(timezone.utc) + expire_time
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp" : expire})
    encoded_jwt = jwt.encode(to_encode,SECRET,ALGORITHM)
    return encoded_jwt

@auth_router.post("/login")
async def login(form_data : Annotated[OAuth2PasswordRequestForm,Depends()]):
    user_list = crud.read(form_data.username)
    password_hased_incoming_bytes = form_data.password.encode("utf-8")
    
    if not user_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Incorrect username or password",headers={"WWW-Authenticate": "Bearer"})

    if not bcrypt.checkpw(password_hased_incoming_bytes,user_list["password"]):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Incorrect username or password",headers={"WWW-Authenticate": "Bearer"})

    jwt_expire_time = timedelta(minutes=TOKEN_EXPIRE)
    jwt_token = create_access_token(data={"sub" : user_list["username"]},expire_time=jwt_expire_time)
    return schema.Token(access_token=jwt_token,token_type="bearer")

