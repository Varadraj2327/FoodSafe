import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.database import initialize_database
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

initialize_database()
client = TestClient(app)

def test_password_hashing_and_verification():
    """Verify password hashing and verification using passlib bcrypt"""
    password = "secret_admin_password_123"
    hashed = get_password_hash(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_jwt_token_generation_and_validation():
    """Verify JWT access token creation and decoding"""
    user_id = 1
    token = create_access_token(subject=user_id)
    assert isinstance(token, str)
    assert len(token) > 20

    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == str(user_id)

def test_login_api_success():
    """Verify POST /api/auth/login with valid default admin credentials"""
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_api_invalid_credentials():
    """Verify POST /api/auth/login with invalid password returns 401 Unauthorized"""
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_user_registration_success():
    """Verify POST /api/auth/register creates a new consumer account and issues a token"""
    import time
    ts = int(time.time() * 1000)
    uname = f"consumer_{ts}"
    email = f"consumer_{ts}@foodsafe.org"
    reg_data = {
        "username": uname,
        "email": email,
        "password": "securepassword123",
        "full_name": "Test Consumer User"
    }
    response = client.post("/api/auth/register", json=reg_data)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Verify profile retrieval using new token
    token = data["access_token"]
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    profile = me_resp.json()
    assert profile["username"] == uname
    assert profile["email"] == email
    assert profile["is_admin"] is False

def test_user_registration_duplicate_username():
    """Verify registration fails with 400 when username is taken"""
    reg_data = {
        "username": "admin",
        "email": "anotheradmin@foodsafe.org",
        "password": "securepassword123"
    }
    response = client.post("/api/auth/register", json=reg_data)
    assert response.status_code == 400
    assert "already taken" in response.json()["detail"]

def test_user_registration_duplicate_email():
    """Verify registration fails with 400 when email is already registered"""
    reg_data = {
        "username": "uniqueuser",
        "email": "admin@foodsafe.org",
        "password": "securepassword123"
    }
    response = client.post("/api/auth/register", json=reg_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_by_email():
    """Verify users can log in using their email address as well as username"""
    response = client.post(
        "/api/auth/login",
        json={"username": "admin@foodsafe.org", "password": "admin123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_protected_route_unauthenticated():
    """Verify GET /api/admin/stats returns 401/403 without Bearer token"""
    response = client.get("/api/admin/stats")
    assert response.status_code in (401, 403)

def test_protected_route_authenticated():
    """Verify GET /api/admin/stats works when providing valid JWT Bearer token"""
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "admin123"}
    )
    token = login_resp.json()["access_token"]

    response = client.get(
        "/api/admin/stats",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    stats = response.json()
    assert "food_count" in stats
    assert "category_count" in stats
    assert stats["admin_user"] == "admin"

