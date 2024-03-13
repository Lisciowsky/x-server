import pytest
from httpx import AsyncClient
from src.server import server  # Ensure you have a way to import your FastAPI app
from src.db.models import Session
from settings import SERVER_HOST, SERVER_PORT, API_VERSION
from datetime import datetime, timedelta


@pytest.fixture
async def client():
    base_url = f"http://{SERVER_HOST}:{SERVER_PORT}"
    async with AsyncClient(app=server, base_url=base_url) as ac:
        yield ac


@pytest.mark.asyncio
async def test_renew_access_token(mocker, client):
    mock_get_session = mocker.patch("src.db.dal.DAL.get_session")
    mock_create_token = mocker.patch(
        "src.token.token_maker.JWTTokenManager.create_token"
    )
    session_id = "test_session_id"
    mock_session = Session(
        id=session_id,
        username="testuser",
        expires_at=datetime.utcnow() + timedelta(hours=1),  # Ensure session is valid
    )
    mock_get_session.return_value = mock_session
    mock_create_token.return_value = (
        "new_access_token",
        {"exp": datetime.utcnow() + timedelta(minutes=30)},
    )
    renew_request = {"session_id": session_id}
    response = await client.post(f"{API_VERSION}/auth/renew_access", json=renew_request)
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_verify_token(mocker, client):
    mock_verify_token = mocker.patch(
        "src.token.token_maker.JWTTokenManager.verify_token"
    )
    token = "valid_token"
    mock_verify_token.return_value = {"username": "testuser", "role": "user"}
    response = await client.get(
        f"{API_VERSION}/auth/verify_token",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json() == {
        "username": "testuser",
        "role": "user",
        "is_valid": True,
    }
