from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from src.db.models import Media, MediaPermission
from src.db.enums import PermissionTypes


async def create_media(async_session: AsyncSession, new_media: Media) -> Media:
    async with async_session.begin() as session:
        try:
            session.add(new_media)
            await session.flush()

            media_permission = MediaPermission(
                granted_to_username=new_media.media_owner,
                media_id=new_media.id,
                permission_type=PermissionTypes.OWNER,
            )
            session.add(media_permission)

            # Eagerly load relationships (if any)
            await session.refresh(new_media)

        except SQLAlchemyError as ex:
            await session.rollback()
            raise ex

        # Expunge the object if you need to pass it around after the session is closed
        session.expunge(new_media)

    # If needed, re-attach to a new session later
    return new_media


async def get_media(
    async_session: AsyncSession, media_name: str, owner_username: str
) -> Media:
    try:
        async with async_session() as session:
            query = select(Media).where(
                Media.media_name == media_name, Media.media_owner == owner_username
            )
            result = await session.execute(query)
            media = result.scalars().first()
            if not media:
                return None
            return media
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_media_by_id(async_session: AsyncSession, media_id: str) -> Media:
    try:
        async with async_session() as session:
            query = select(Media).where(Media.id == media_id)
            result = await session.execute(query)
            media = result.scalars().first()
            if not media:
                return None
            return media
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_permission_for_user(
    async_session: AsyncSession, media_id: int, username: str
) -> MediaPermission:
    try:
        async with async_session() as session:
            query = select(MediaPermission).where(
                MediaPermission.media_id == media_id,
                MediaPermission.granted_to_username == username,
            )
            result = await session.execute(query)
            return result.scalars().first()
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex
