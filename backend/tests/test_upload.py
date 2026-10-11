import io
import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.database import initialize_database

initialize_database()
client = TestClient(app)

def test_upload_image_unauthenticated():
    """Verify POST /api/upload/image returns 401/403 without Bearer token"""
    files = {"file": ("test.png", b"fake-image-bytes", "image/png")}
    response = client.post("/api/upload/image", files=files)
    assert response.status_code in (401, 403)

def test_upload_image_success():
    """Verify POST /api/upload/image successfully uploads image and returns valid static URL"""
    # 1. Login as admin
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "admin123"}
    )
    token = login_resp.json()["access_token"]

    # 2. Upload sample image
    image_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4"
    files = {"file": ("sample_commodity.png", io.BytesIO(image_bytes), "image/png")}

    response = client.post(
        "/api/upload/image",
        files=files,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert data["url"].startswith("/static/uploads/")
    assert data["filename"].endswith(".png")

    # 3. Verify serving uploaded static file
    static_resp = client.get(data["url"])
    assert static_resp.status_code == 200
    assert static_resp.content == image_bytes
