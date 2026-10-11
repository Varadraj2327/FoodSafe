import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure app package is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.database import initialize_database

initialize_database()
client = TestClient(app)

def test_health_check():
    """Verify GET /api/health returns 200 OK and healthy status"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "FoodSafe API"
    assert data["version"] == "1.0.0"

def test_get_categories():
    """Verify GET /api/categories returns a list of categories including new categories"""
    response = client.get("/api/categories")
    assert response.status_code == 200
    categories = response.json()
    assert isinstance(categories, list)
    assert len(categories) >= 9
    names = [c["name"] for c in categories]
    assert "Dairy" in names
    assert "Spices" in names
    assert "Protein" in names
    assert "Grains" in names
    assert "Fruits" in names
    assert "Bakery" in names
    assert "Nuts" in names

def test_get_foods():
    """Verify GET /api/foods returns all food items with nested category data"""
    response = client.get("/api/foods")
    assert response.status_code == 200
    foods = response.json()
    assert isinstance(foods, list)
    assert len(foods) >= 10
    names = [f["name"] for f in foods]
    for required_item in ["Milk", "Turmeric", "Honey", "Tea", "Eggs", "Rice", "Apples", "Bread", "Almonds", "Bananas"]:
        assert required_item in names

def test_new_six_foods_exist():
    """Verify all 6 newly added food items can be searched and retrieved individually"""
    new_items = ["Eggs", "Rice", "Apples", "Bread", "Almonds", "Bananas"]
    for item_name in new_items:
        res = client.get(f"/api/foods/search?q={item_name}")
        assert res.status_code == 200
        matches = res.json()
        assert len(matches) >= 1
        matched_food = matches[0]
        assert matched_food["name"] == item_name
        assert "adulterants" in matched_food
        assert "consumer_precautions" in matched_food

def test_get_food_by_id_valid():
    """Verify GET /api/foods/1 returns valid food commodity item"""
    response = client.get("/api/foods/1")
    assert response.status_code == 200
    food = response.json()
    assert food["id"] == 1
    assert "adulterants" in food
    assert "consumer_precautions" in food

def test_get_food_by_id_invalid():
    """Verify GET /api/foods/99999 returns 404 Not Found"""
    response = client.get("/api/foods/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Food item not found"

def test_search_foods_case_insensitive():
    """Verify GET /api/foods/search case-insensitive query matching"""
    res_lower = client.get("/api/foods/search?q=eggs")
    assert res_lower.status_code == 200
    foods_lower = res_lower.json()
    assert len(foods_lower) >= 1
    assert foods_lower[0]["name"] == "Eggs"

    res_upper = client.get("/api/foods/search?q=EGGS")
    assert res_upper.status_code == 200
    foods_upper = res_upper.json()
    assert len(foods_upper) >= 1
    assert foods_upper[0]["name"] == "Eggs"

def test_search_foods_empty_query():
    """Verify GET /api/foods/search with empty query returns []"""
    response = client.get("/api/foods/search?q=")
    assert response.status_code == 200
    assert response.json() == []

