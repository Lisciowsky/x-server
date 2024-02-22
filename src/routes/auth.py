from fastapi import APIRouter, Depends, Body
from pydantic import BaseModel

auth_router = APIRouter(prefix="/auth")


class UserLoginRequest(BaseModel):
    username: str
    password: str


class LoginReponse(BaseModel):
    access_token: str
    refresh_token: str


@auth_router.post("/")
async def login_for_access_token(user_login: UserLoginRequest):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
