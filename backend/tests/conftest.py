import pytest
from app.database import initialize_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """
    Ensure database tables and initial seed data exist before executing tests.
    """
    initialize_database()
