import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.sql import text


DATABASE_URL = "postgresql+asyncpg://username:password@localhost:5432/twitter_db"
# DATABASE_URL = "postgresql+asyncpg://username:password@dev-postgres-instance.cbsoi6gs4a1o.eu-central-1.rds.amazonaws.com:5432/twitter_db"


async def get_current_connections(engine: AsyncEngine):
    async with AsyncSession(engine) as session:
        # The query to check current connections. This query might need adjustments based on your PG version
        result = await session.execute(
            text("SELECT count(*) FROM pg_stat_activity WHERE datname = 'twitter_db';")
        )
        connections = result.scalar_one()
        print(f"Current connections: {connections}")


async def main():
    engine = create_async_engine(DATABASE_URL, echo=True)
    while True:
        await get_current_connections(engine)
        await asyncio.sleep(
            1
        )  # Check every 10 seconds. Adjust the sleep time as needed.


if __name__ == "__main__":
    asyncio.run(main())
