import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.database import initialize_database

initialize_database()
client = TestClient(app)

def get_auth_token():
    """Helper to login and return JWT bearer token"""
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "admin123"}
    )
    return login_resp.json()["access_token"]

def test_get_user_profile():
    """Verify GET /api/users/me returns profile info including created_at and full_name"""
    token = get_auth_token()
    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "admin"
    assert "email" in data
    assert "created_at" in data

def test_update_user_profile():
    """Verify PUT /api/users/me updates display name / full name"""
    token = get_auth_token()
    response = client.put(
        "/api/users/me",
        json={"full_name": "FoodSafe Administrator", "email": "admin@foodsafe.org"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "FoodSafe Administrator"

def test_favorites_workflow():
    """Verify Favorites system: Add to favorites, check favorite status, get all favorites, and remove"""
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get first food ID
    foods_resp = client.get("/api/foods")
    foods = foods_resp.json()
    assert len(foods) > 0
    food_id = foods[0]["id"]

    # 2. Add to favorites
    add_resp = client.post(f"/api/favorites/{food_id}", headers=headers)
    assert add_resp.status_code == 201

    # 3. Check status
    check_resp = client.get(f"/api/favorites/check/{food_id}", headers=headers)
    assert check_resp.status_code == 200
    assert check_resp.json()["is_favorite"] is True

    # 4. View all favorites
    favs_resp = client.get("/api/favorites", headers=headers)
    assert favs_resp.status_code == 200
    fav_foods = favs_resp.json()
    assert any(f["id"] == food_id for f in fav_foods)

    # 5. Remove from favorites
    rem_resp = client.delete(f"/api/favorites/{food_id}", headers=headers)
    assert rem_resp.status_code == 200

    # 6. Verify removed
    check_resp_after = client.get(f"/api/favorites/check/{food_id}", headers=headers)
    assert check_resp_after.json()["is_favorite"] is False
