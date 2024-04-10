# run_tests.py
import sys
from pathlib import Path
import pytest

from alembic.config import Config
from alembic import command
from settings import MOCK_DB_URL

# run migrations
alembic_cfg = Config("alembic.ini")
alembic_cfg.set_main_option(
    "sqlalchemy.url", f"postgresql://{''.join(MOCK_DB_URL.split('://')[1:])}"
)
# command.revision(alembic_cfg, autogenerate=True, message="Initial migration")
command.upgrade(alembic_cfg, "head")


# Optionally, specify pytest arguments
pytest_args = [
    "src/db",  # Directory with tests to run
    "src/api/routes",
    # '-p no:warnings'
    # '--verbose',  # Verbose output
    "-x",
    # Add other pytest arguments as needed
]

# Run pytest programmatically
if __name__ == "__main__":
    sys.exit(pytest.main(pytest_args))
