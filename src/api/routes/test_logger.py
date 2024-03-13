import pytest
import io
from loguru import logger


@pytest.fixture
def loguru_sink():
    sink = io.StringIO()
    sink_id = logger.add(sink, format="{message}")
    yield sink  # This allows the test to use the sink
    # Cleanup: remove the sink after the test to avoid side effects
    logger.remove(sink_id)


def test_loguru_logging_with_mocker(loguru_sink):
    logger.warning("This is a warning")
    loguru_sink.seek(0)
    log_contents = loguru_sink.read()
    assert "This is a warning" in log_contents
