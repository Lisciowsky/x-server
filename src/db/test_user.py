import pytest

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text

from src.db.models import User
from src.db.dal import DAL
from settings import MOCK_DB_URL

from utils.password import hash_password
from utils.random import (
    generate_random_email,
    generate_random_full_name,
    generate_random_password,
    generate_random_username,
)


def create_random_user():
    return User(
        email=generate_random_email(),
        full_name=generate_random_full_name(),
        username=generate_random_username(),
        hashed_password=hash_password(generate_random_password()),
        
    )


@pytest.fixture(autouse=True, scope="function")
async def clear_data_after():
    yield
    engine = create_async_engine(MOCK_DB_URL, echo=True)
    async with engine.begin() as conn:
        await conn.execute(text('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;'))


@pytest.fixture(scope="function")
def dal_instance():
    return DAL(db_url=MOCK_DB_URL)


@pytest.mark.asyncio
async def test_create_user(dal_instance):
    user = create_random_user()

    created_user = await dal_instance.create_user(user)

    assert created_user.username is not None
    assert created_user.email is not None
    assert created_user.hashed_password is not None
    assert created_user.full_name is not None
    assert created_user.is_email_verified is False
    assert created_user.password_changed_at is not None


@pytest.mark.asyncio
async def test_create_duplicate_user(dal_instance):
    user1 = create_random_user()

    created_user_1 = await dal_instance.create_user(user1)
    assert created_user_1.username is not None
    assert created_user_1.full_name is not None

    user2 = create_random_user()
    user2.username = created_user_1.username
    user2.email = created_user_1.email

    with pytest.raises(IntegrityError) as exc_info:
        await dal_instance.create_user(user2)

    assert (
        "unique constraint" in str(exc_info.value).lower()
        or "duplicate key value violates unique constraint"
        in str(exc_info.value).lower()
    )


@pytest.mark.asyncio
async def test_update_user(dal_instance):
    original_user = create_random_user()
    created_user = await dal_instance.create_user(original_user)

    new_email = generate_random_email()
    new_full_name = generate_random_full_name()

    created_user.email = new_email
    created_user.full_name = new_full_name

    updated_user = await dal_instance.update_user(created_user.username, created_user)

    assert updated_user.email == new_email
    assert updated_user.full_name == new_full_name
    assert updated_user.username == created_user.username


@pytest.mark.asyncio
async def test_delete_user(dal_instance):
    user = create_random_user()
    created_user = await dal_instance.create_user(user)
    await dal_instance.delete_user(created_user.username)
    retrieved_user = await dal_instance.get_user(created_user.username)
    assert retrieved_user is None
