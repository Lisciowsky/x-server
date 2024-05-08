import pytest
import uuid
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

from src.db.models import Session
from settings import MOCK_DB_URL

from src.db.test_user import create_random_user

from src.db.dal import DAL


def create_random_session(user):
    return Session(
        id=uuid.uuid4(),
        username=user.username,
        refresh_token=str(uuid.uuid4()),
        user_agent="Test User Agent",
        client_ip="127.0.0.1",
        is_blocked=False,
        expires_at=datetime.now() + timedelta(days=1),
    )


@pytest.fixture(autouse=True, scope="function")
async def clear_sessions_after():
    yield
    engine = create_async_engine(MOCK_DB_URL, echo=True)
    async with engine.begin() as conn:
        await conn.execute(text('TRUNCATE TABLE "session" RESTART IDENTITY CASCADE;'))


@pytest.fixture(scope="function")
def dal_instance():
    return DAL(db_url=MOCK_DB_URL)


@pytest.mark.asyncio
async def test_create_and_get_session(dal_instance):
    test_user = create_random_user()
    created_user = await dal_instance.create_user(test_user)
    session = create_random_session(created_user)
    created_session = await dal_instance.create_session(session)

    assert created_session.id is not None
    assert created_session.username == created_user.username

    retrieved_session = await dal_instance.get_session(created_session.id)

    assert retrieved_session is not None
    assert retrieved_session.id == created_session.id
    assert retrieved_session.username == created_session.username
