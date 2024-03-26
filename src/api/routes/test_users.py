import uuid
import pytest
import jwt
from datetime import datetime, timedelta
from httpx import AsyncClient
from sqlalchemy.exc import IntegrityError

from src.server import server
from src.db.models import User, Session
from src.token.token_maker import JWTTokenManager, UserPayload
from src.utils.password import hash_password

from settings import (
    SERVER_HOST,
    SERVER_PORT,
    API_VERSION,
    JWT_SECRET,
    ACCESS_TOKEN_DURATION_MINUTES,
    REFRESH_TOKEN_DURATION_MINUTES,
)

from test_logger import loguru_sink  # as dependency in test_db_connection_failure


@pytest.fixture
async def client():
    base_url = f"http://{SERVER_HOST}:{SERVER_PORT}"
    async with AsyncClient(app=server, base_url=base_url) as ac:
        yield ac


def generate_test_token(username: str, role: str = "user"):
    access_token, _ = JWTTokenManager.create_token(
        username=username,
        role=role,
    )
    return access_token


def generate_expired_token(username: str, role: str):
    expired_delta = timedelta(minutes=-5)
    expire = datetime.utcnow() + expired_delta
    payload = UserPayload(username=username, role=role, exp=expire)
    dict_payload = payload.dict()
    dict_payload["id"] = str(dict_payload["id"])
    token = jwt.encode(dict_payload, JWT_SECRET, algorithm="HS256")
    return token


@pytest.mark.asyncio
async def test_create_user(mocker, client):
    mock_create_user = mocker.patch("src.db.dal.DAL.create_user")
    test_user_data = {
        "username": "testuser",
        "password": "testpass",
        "fullname": "Test User",
        "email": "test@example.com",
        "role": "user",
    }
    mock_user = User(
        username=test_user_data["username"],
        full_name=test_user_data["fullname"],
        email=test_user_data["email"],
        role=test_user_data["role"],
        hashed_password="hashed_testpass",  # Assuming the password gets hashed
    )
    mock_create_user.return_value = mock_user
    response = await client.post(f"{API_VERSION}/users/", json=test_user_data)
    assert response.status_code == 201
    assert response.json() == {
        "username": test_user_data["username"],
        "fullname": test_user_data["fullname"],
        "email": test_user_data["email"],
        "role": test_user_data["role"],
    }


@pytest.mark.asyncio
async def test_user_can_access_own_info(mocker, client):
    mock_get_user = mocker.patch("src.db.dal.DAL.get_user")
    test_username = "testuser"
    test_user = User(
        username=test_username,
        full_name="Test User",
        email="test@example.com",
        hashed_password="hashed_testpass",
    )
    mock_get_user.return_value = test_user
    mocker.patch(
        "src.token.token_maker.get_current_user",
        return_value=UserPayload(
            username=test_username,
            role="user",
            exp=datetime.utcnow()
            + timedelta(minutes=int(ACCESS_TOKEN_DURATION_MINUTES)),
        ),
    )
    token_for_test_user = generate_test_token(username=test_username)
    cookies = {"access_token": token_for_test_user}  # Tokens are now passed in cookies
    response = await client.get(f"{API_VERSION}/users/{test_username}", cookies=cookies)

    assert response.status_code == 200
    assert response.json() == {
        "username": test_user.username,
        "fullname": test_user.full_name,
        "email": test_user.email,
        "role": test_user.role,
    }


@pytest.mark.asyncio
async def test_user_cannot_access_other_user_info(mocker, client):
    mock_get_user = mocker.patch("src.db.dal.DAL.get_user")
    mocker.patch(
        "src.token.token_maker.get_current_user",
        return_value=UserPayload(
            username="Ben",
            role="user",
            exp=datetime.utcnow()
            + timedelta(minutes=int(ACCESS_TOKEN_DURATION_MINUTES)),
        ),
    )
    token_for_ben = generate_test_token(username="Ben")
    cookies = {"access_token": token_for_ben}  # Use cookies for authentication
    jake_user = User(
        username="Jake",
        full_name="Jake Example",
        email="jake@example.com",
        hashed_password="hashed_jakepass",
    )
    mock_get_user.return_value = jake_user
    response = await client.get(
        f"{API_VERSION}/users/Jake",
        cookies=cookies,
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_expired_token_handling(mocker, client):
    expired_token = generate_expired_token(username="testuser", role="user")
    cookies = {"access_token": expired_token}
    response = await client.get(f"{API_VERSION}/users/testuser", cookies=cookies)
    assert response.status_code == 401
    assert "expired" in response.json().get("detail", "").lower()


@pytest.mark.asyncio
async def test_create_user_integrity_error(mocker, client):
    mocker.patch(
        "src.db.dal.DAL.create_user",
        side_effect=IntegrityError(statement=None, params=None, orig=None),
    )
    test_user_data = {
        "username": "existinguser",
        "password": "testpass",
        "fullname": "Existing User",
        "email": "existing@example.com",
    }
    response = await client.post(f"{API_VERSION}/users/", json=test_user_data)
    assert response.status_code == 422
    assert "unable to create user due to conflict" in response.json().get("detail", "")


@pytest.mark.asyncio
async def test_create_user_integrity_error(mocker, client):
    mocker.patch(
        "src.db.dal.DAL.create_user",
        side_effect=IntegrityError(statement=None, params=None, orig=None),
    )
    test_user_data = {
        "username": "existinguser",
        "password": "testpass",
        "fullname": "Existing User",
        "email": "existing@example.com",
    }
    response = await client.post(f"{API_VERSION}/users/", json=test_user_data)
    assert response.status_code == 422
    assert "unable to create user due to conflict" in response.json().get("detail", "")


@pytest.mark.asyncio
async def test_db_connection_failure(loguru_sink, mocker, client):
    token_for_ben = generate_test_token(username="Ben")
    mock_dal_method = mocker.patch(
        "src.db.dal.DAL.get_user", side_effect=Exception("Connect call failed")
    )
    cookies = {"access_token": token_for_ben}

    response = await client.get(f"{API_VERSION}/users/Ben", cookies=cookies)
    assert response.status_code == 500
    mock_dal_method.assert_called_once()
    loguru_sink.seek(0)
    log_contents = loguru_sink.read()
    assert (
        "Failed to fetch user: Connect call failed" in log_contents
    )  # Adjust the message as needed


@pytest.mark.asyncio
async def test_login_success(mocker, client):
    # Setup mock user and session
    password = "testpass"
    hashed_testpass = hash_password(password=password)
    test_user = User(
        username="testuser",
        hashed_password=hashed_testpass,
        email="test@example.com",
        full_name="Test User",
        role="user",
    )
    test_session = Session(
        id=uuid.uuid4(),
        username="testuser",
        refresh_token="refresh_token",
        user_agent="",
        client_ip="",
        expires_at=datetime.utcnow() + timedelta(days=1),
    )

    # Mock DAL.get_user to return the test user
    mocker.patch("src.db.dal.DAL.get_user", return_value=test_user)

    # Mock verify_password to return True
    mocker.patch("src.utils.password.verify_password", return_value=True)

    # Prepare mock payloads for access and refresh tokens
    access_payload = UserPayload(
        username="testuser",
        role="user",
        exp=datetime.utcnow() + timedelta(minutes=int(ACCESS_TOKEN_DURATION_MINUTES)),
    )
    refresh_payload = UserPayload(
        username="testuser",
        role="user",
        exp=datetime.utcnow() + timedelta(minutes=int(REFRESH_TOKEN_DURATION_MINUTES)),
        id=uuid.uuid4(),
    )

    # Mock JWTTokenManager.create_token to return dummy tokens and payloads
    mocker.patch(
        "src.token.token_maker.JWTTokenManager.create_token",
        side_effect=[
            ("access_token", access_payload),
            ("refresh_token", refresh_payload),
        ],
    )

    # Mock DAL.create_session to return the test session
    mocker.patch("src.db.dal.DAL.create_session", return_value=test_session)

    # Perform login request
    login_data = {"username": "testuser", "password": password}
    response = await client.post(f"{API_VERSION}/users/login", json=login_data)

    # Assertions
    assert response.status_code == 200
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies


@pytest.mark.asyncio
async def test_user_not_found(mocker, client):
    # Mock DAL.get_user to return None, simulating user not found
    mocker.patch("src.db.dal.DAL.get_user", return_value=None)

    # Perform login request with a non-existent user
    login_data = {"username": "nonexistentuser", "password": "password"}
    response = await client.post(f"{API_VERSION}/users/login", json=login_data)

    # Assertions
    assert response.status_code == 404
    assert "Not Found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_invalid_password(mocker, client):
    # Setup mock user
    password = "testpass"
    hashed_testpass = hash_password(password=password)

    test_user = User(
        username="testuser",
        hashed_password=hashed_testpass,  # Simulate a different password
        email="test@example.com",
        full_name="Test User",
        role="user",
    )

    # Mock DAL.get_user to return the test user
    mocker.patch("src.db.dal.DAL.get_user", return_value=test_user)

    # Mock verify_password to return False, simulating password mismatch
    mocker.patch("src.utils.password.verify_password", return_value=False)

    # Perform login request with an invalid password
    login_data = {"username": "testuser", "password": "wrongpassword"}
    response = await client.post(f"{API_VERSION}/users/login", json=login_data)

    # Assertions
    assert response.status_code == 401
    assert "invalid password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_unable_to_get_user(mocker, client):
    # Mock DAL.get_user to raise an exception, simulating a database error
    mocker.patch("src.db.dal.DAL.get_user", side_effect=Exception("Database error"))

    # Perform login request
    login_data = {"username": "testuser", "password": "testpass"}
    response = await client.post(f"{API_VERSION}/users/login", json=login_data)

    # Assertions
    assert response.status_code == 500
    assert "unable to get user" in response.json()["detail"]


@pytest.mark.asyncio
async def test_unable_to_create_access_token_for_user(mocker, client):
    # Setup mock user
    test_user = User(
        username="testuser",
        hashed_password=hash_password("testpass"),
        email="test@example.com",
        full_name="Test User",
        role="user",
    )

    # Mock DAL.get_user to return the test user
    mocker.patch("src.db.dal.DAL.get_user", return_value=test_user)

    # Mock verify_password to return True
    mocker.patch("src.utils.password.verify_password", return_value=True)

    # Mock JWTTokenManager.create_token to raise an exception when trying to create access token
    mocker.patch(
        "src.token.token_maker.JWTTokenManager.create_token",
        side_effect=[Exception("Token creation error"), None],
    )

    # Perform login request
    login_data = {"username": "testuser", "password": "testpass"}
    response = await client.post(f"{API_VERSION}/users/login", json=login_data)

    # Assertions
    assert response.status_code == 500
    assert "unable to create access_token for user" in response.json()["detail"]


@pytest.mark.asyncio
async def test_unable_to_create_session(mocker, client):
    # Setup mock user
    test_user = User(
        username="testuser",
        hashed_password=hash_password(
            "testpass"
        ),  # Assuming hash_password is correctly mocked or implemented
        email="test@example.com",
        full_name="Test User",
        role="user",
    )

    # Mock DAL.get_user to return the test user
    mocker.patch("src.db.dal.DAL.get_user", return_value=test_user)

    # Mock verify_password to return True
    mocker.patch("src.utils.password.verify_password", return_value=True)

    # Prepare mock payloads for access and refresh tokens
    access_payload = UserPayload(
        username="testuser",
        role="user",
        exp=datetime.utcnow() + timedelta(minutes=int(ACCESS_TOKEN_DURATION_MINUTES)),
    )
    refresh_payload = UserPayload(
        username="testuser",
        role="user",
        exp=datetime.utcnow() + timedelta(days=int(REFRESH_TOKEN_DURATION_MINUTES)),
        id=uuid.uuid4(),
    )

    # Mock JWTTokenManager.create_token to return dummy tokens and payloads
    mocker.patch(
        "src.token.token_maker.JWTTokenManager.create_token",
        side_effect=[
            ("access_token", access_payload),
            ("refresh_token", refresh_payload),
        ],
    )

    # Mock DAL.create_session to raise an exception, simulating a failure in session creation
    mocker.patch(
        "src.db.dal.DAL.create_session", side_effect=Exception("Session creation error")
    )

    # Perform login request
    login_data = {"username": "testuser", "password": "testpass"}
    response = await client.post(f"{API_VERSION}/users/login", json=login_data)

    # Assertions
    assert response.status_code == 500
    assert (
        "unable to create session" in response.json()["detail"]
    ), "The error message did not match expected output"


@pytest.mark.asyncio
async def test_access_user_info_with_expired_token(client):
    expired_token = generate_expired_token(username="testuser", role="user")
    cookies = {"access_token": expired_token}
    response = await client.get(f"{API_VERSION}/users/testuser", cookies=cookies)
    assert (
        response.status_code == 401
    ), "Expected to be unauthorized due to expired token"
    assert (
        "expired" in response.json().get("detail", "").lower()
    ), "Expected error message to indicate that the token is expired"
