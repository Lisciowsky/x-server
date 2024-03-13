import pytest
from unittest.mock import patch

from src.db.dal import DAL


@pytest.mark.asyncio
async def test_run_migrations():
    with patch("alembic.command.upgrade") as mock_upgrade:
        dal = DAL()
        await dal.run_migrations()
        mock_upgrade.assert_called_once()
