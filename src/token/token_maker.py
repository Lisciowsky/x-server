import jwt
import uuid
from datetime import datetime, timedelta
from pydantic import BaseModel, Field

from settings import JWT_SECRET, ACCESS_TOKEN_DURATION_MINUTES

from fastapi import Header, HTTPException, Request
import jwt
from jwt import PyJWTError


class UserPayload(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    username: str
    role: str
    exp: datetime


def get_current_user(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token missing")

    try:
        decoded_payload = jwt.decode(access_token, JWT_SECRET, algorithms=["HS256"])
        user_payload = UserPayload(**decoded_payload)
        return user_payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid access token")


def get_current_user_header_based_authentication(authorization: str = Header(None)):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")

        decoded_payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        decoded_payload_model = UserPayload(**decoded_payload)
        if decoded_payload_model is None:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        return decoded_payload_model  # or return the user object from your database
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Expired JWT token")
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid JWT token")
    except ValueError:
        raise HTTPException(
            status_code=401, detail="Invalid authorization header format"
        )


class JWTTokenManager:
    @staticmethod
    def create_token(username: str, role: str, expires_delta: timedelta = None):
        if expires_delta is None:
            expires_delta = timedelta(minutes=int(ACCESS_TOKEN_DURATION_MINUTES))
        expire = datetime.utcnow() + expires_delta
        payload = UserPayload(username=username, role=role, exp=expire)
        dict_payload = payload.model_dump()
        dict_payload["id"] = str(dict_payload["id"])
        token = jwt.encode(dict_payload, JWT_SECRET, algorithm="HS256")
        return token, payload

    @staticmethod
    def verify_token(token):
        decoded_payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        decoded_payload_model = UserPayload(**decoded_payload)
        return decoded_payload_model
