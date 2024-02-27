import jwt
import uuid
from datetime import datetime, timedelta
from pydantic import BaseModel, Field

# Assuming the JWT_SECRET is defined in a settings.py file
from settings import JWT_SECRET, ACCESS_TOKEN_DURATION_MINUTES


class Payload(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    username: str
    role: str
    exp: datetime


class JWTTokenManager:
    @staticmethod
    def create_token(username: str, role: str, expires_delta: timedelta = None):
        if expires_delta is None:
            # Default to 1 hour if no expiration delta is provided
            expires_delta = timedelta(minutes=int(ACCESS_TOKEN_DURATION_MINUTES))

        # Set the expiration time
        expire = datetime.utcnow() + expires_delta

        # Prepare the payload
        payload = Payload(username=username, role=role, exp=expire)

        # JWT does requre payload to be of string type
        dict_payload = payload.model_dump()
        dict_payload["id"] = str(dict_payload["id"])

        token = jwt.encode(dict_payload, JWT_SECRET, algorithm="HS256")
        return token, payload

    @staticmethod
    def verify_token(token):
        try:
            # Decode the token
            decoded_payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            decoded_payload_model = Payload(**decoded_payload)
            return decoded_payload
        except jwt.ExpiredSignatureError:
            print("Token has expired.")
            return None
        except jwt.PyJWTError as e:
            print(f"Token verification error: {e}")
            return None
