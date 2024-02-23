import jwt
from datetime import datetime, timedelta

# Assuming the JWT_SECRET is defined in a settings.py file
from settings import JWT_SECRET, ACCESS_TOKEN_DURATION_MINUTES


class JWTTokenManager:
    @staticmethod
    def create_token(username: str, role: str, expires_delta: timedelta = None):
        if expires_delta is None:
            # Default to 1 hour if no expiration delta is provided
            expires_delta = timedelta(minutes=int(ACCESS_TOKEN_DURATION_MINUTES))

        # Set the expiration time
        expire = datetime.utcnow() + expires_delta

        # Prepare the payload
        payload = {"username": username, "role": role, "exp": expire}

        # Encode the token
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        return token, payload

    @staticmethod
    def verify_token(token):
        try:
            # Decode the token
            decoded_payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            return decoded_payload
        except jwt.ExpiredSignatureError:
            print("Token has expired.")
            return None
        except jwt.PyJWTError as e:
            print(f"Token verification error: {e}")
            return None
