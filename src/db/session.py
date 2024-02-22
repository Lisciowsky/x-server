from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select

from src.db.models import Session


async def create_session(async_session: AsyncSession, new_session: Session) -> Session:
    try:
        async with async_session() as session:
            session.add(new_session)
            await session.commit()
            await session.refresh(new_session)
            return new_session
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_session(async_session: AsyncSession, session_id: UUID) -> Session:
    try:
        async with async_session() as session:
            stmt = select(Session).where(Session.id == session_id)
            result = await session.execute(stmt)
            session = result.scalar_one_or_none()
            return session
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex
