import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.sql import text

DATABASE_URL = "postgresql+asyncpg://username:password@my-postgres-instance.cbsoi6gs4a1o.eu-central-1.rds.amazonaws.com:5432/twitter_db"


async def terminate_idle_connections(engine):
    async with AsyncSession(engine) as session:
        # This query finds idle connections to a specific database and attempts to terminate them.
        # WARNING: Use with caution, especially in production environments.
        terminate_query = text(
            """
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'twitter_db' -- Replace with your database name
            AND state = 'idle'  -- Targeting idle connections
            AND pid <> pg_backend_pid();  -- Avoid terminating the current connection
        """
        )
        result = await session.execute(terminate_query)
        await session.commit()  # Ensure changes are committed
        print(f"Idle connections terminated.")


async def main():
    engine = create_async_engine(DATABASE_URL, echo=True)
    await terminate_idle_connections(engine)


if __name__ == "__main__":
    asyncio.run(main())
