from passlib.context import CryptContext

# Create a CryptContext object with the desired hash algorithm(s)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    # Hash the password using the selected algorithm
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify the plain password against the hashed password
    return pwd_context.verify(plain_password, hashed_password)
