import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure app package is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app

client = TestClient(app)

def test_contact_submission_success():
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "subject": "Adulteration Query",
        "message": "I would like to report feedback on the milk purity testing guidelines."
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Thank you" in data["message"]

def test_contact_submission_invalid_email():
    payload = {
        "name": "Jane Doe",
        "email": "invalid-email-format",
        "subject": "Adulteration Query",
        "message": "I would like to report feedback."
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422
