from fastapi import APIRouter
from pydantic import BaseModel

auth_router = APIRouter(prefix="/auth")


class RenewAccessRequest(BaseModel):
    refresh_token: str


class RenewAccessResponse(BaseModel):
    access_token: str
    access_token_expires_at: str


@auth_router.post("/renew_access")
async def renew_access_token(renew_request: RenewAccessRequest):
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
