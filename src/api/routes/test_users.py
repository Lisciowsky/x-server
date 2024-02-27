import pytest
from httpx import AsyncClient
from src.server import server
from src.db.models import User, Session
from settings import SERVER_HOST, SERVER_PORT, API_VERSION
from src.token.token_maker import JWTTokenManager
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_create_user(mocker):
    # Mocking DAL.create_user method
    mock_create_user = mocker.patch("src.db.dal.DAL.create_user")

    test_user_data = {
        "username": "testuser",
        "password": "testpass",
        "fullname": "Test User",
        "email": "test@example.com",
    }

    mock_user = User(
        username=test_user_data["username"],
        full_name=test_user_data["fullname"],
        email=test_user_data["email"],
        hashed_password="hashed_testpass",  # Assuming the password gets hashed
    )
    mock_create_user.return_value = mock_user

    base_url = f"http://{SERVER_HOST}:{SERVER_PORT}"

    async with AsyncClient(app=server, base_url=base_url) as ac:
        response = await ac.post(f"{API_VERSION}/users/", json=test_user_data)
        assert response.status_code == 201
        assert response.json() == {
            "username": test_user_data["username"],
            "fullname": test_user_data["fullname"],
            "email": test_user_data["email"],
        }


# Test for user login
# @pytest.mark.asyncio
# async def test_login_user(mocker):
#     # Mock necessary DAL methods and JWTTokenManager.create_token
#     mock_get_user = mocker.patch("src.db.dal.DAL.get_user")
#     mock_create_session = mocker.patch("src.db.dal.DAL.create_session")
#     mocker.patch.object(
#         JWTTokenManager,
#         "create_token",
#         side_effect=[
#             (
#                 "access_token",
#                 {"exp": datetime.now() + timedelta(hours=1), "username": "testuser"},
#             ),
#             (
#                 "refresh_token",
#                 {
#                     "id": "session_id",
#                     "exp": datetime.now() + timedelta(days=1),
#                     "username": "testuser",
#                 },
#             ),
#         ],
#     )

#     # Test user and session data
#     test_user = User(
#         username="testuser",
#         full_name="Test User",
#         email="test@example.com",
#         hashed_password="hashed_testpass",
#     )
#     test_session = Session(
#         id="session_id",
#         username="testuser",
#         refresh_token="refresh_token",
#         user_agent="",
#         client_ip="",
#         expires_at=datetime.now() + timedelta(days=1),
#     )

#     # Setup mock returns
#     mock_get_user.return_value = test_user
#     mock_create_session.return_value = test_session

#     login_data = {"username": "testuser", "password": "testpass"}

#     base_url = f"http://{SERVER_HOST}:{SERVER_PORT}"
#     async with AsyncClient(app=server, base_url=base_url) as ac:
#         response = await ac.post(f"{API_VERSION}/users/login", json=login_data)
#         assert response.status_code == 200
#         assert "access_token" in response.json()
#         assert "refresh_token" in response.json()


# Test for getting a user
@pytest.mark.asyncio
async def test_get_user(mocker):
    # Mock DAL.get_user method
    mock_get_user = mocker.patch("src.db.dal.DAL.get_user")

    # Test user data
    test_user = User(
        username="testuser",
        full_name="Test User",
        email="test@example.com",
        hashed_password="hashed_testpass",
    )
    mock_get_user.return_value = test_user

    username = "testuser"
    base_url = f"http://{SERVER_HOST}:{SERVER_PORT}"
    async with AsyncClient(app=server, base_url=base_url) as ac:
        response = await ac.get(f"{API_VERSION}/users/{username}")
        assert response.status_code == 200
        assert response.json() == {
            "username": test_user.username,
            "fullname": test_user.full_name,
            "email": test_user.email,
        }
