import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import get_db, Base
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.models.category import Category
from app.models.food import Food
from app.models.favorite import Favorite
from app.models.quiz_question import QuizQuestion
from app.models.quiz_option import QuizOption
from app.models.quiz_result import QuizResult

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Users
    reg_user = User(
        username="reguser",
        email="reguser@example.com",
        hashed_password=get_password_hash("password123"),
        is_admin=False
    )
    admin_user = User(
        username="adminuser",
        email="adminuser@example.com",
        hashed_password=get_password_hash("admin123"),
        is_admin=True
    )
    db.add_all([reg_user, admin_user])
    db.commit()

    # Category & Food
    cat1 = Category(name="Dairy Products", description="Dairy items")
    db.add(cat1)
    db.flush()

    f1 = Food(name="Pure Milk", category_id=cat1.id, view_count=10)
    f2 = Food(name="Desi Ghee", category_id=cat1.id, view_count=25)
    db.add_all([f1, f2])
    db.commit()

    # Favorites
    fav1 = Favorite(user_id=reg_user.id, food_id=f1.id)
    db.add(fav1)
    db.commit()

    # Quiz Results
    qr1 = QuizResult(user_id=reg_user.id, score=4, total_questions=5, percentage=80.0)
    qr2 = QuizResult(user_id=admin_user.id, score=5, total_questions=5, percentage=100.0)
    db.add_all([qr1, qr2])
    db.commit()

    yield
    db.close()
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.pop(get_db, None)


def get_auth_headers(user_id: int):
    token = create_access_token(subject=user_id)
    return {"Authorization": f"Bearer {token}"}


def test_admin_analytics_overview():
    admin_headers = get_auth_headers(user_id=2)
    response = client.get("/api/admin/analytics/overview", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_users"] == 2
    assert data["total_foods"] == 2
    assert data["total_categories"] == 1
    assert data["total_quiz_attempts"] == 2
    assert data["average_quiz_score"] == 90.0
    assert data["total_favorites"] == 1


def test_admin_analytics_foods():
    admin_headers = get_auth_headers(user_id=2)
    response = client.get("/api/admin/analytics/foods", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["most_favorited_foods"]) >= 1
    assert data["most_favorited_foods"][0]["food_name"] == "Pure Milk"
    assert len(data["most_viewed_foods"]) >= 1
    assert data["most_viewed_foods"][0]["food_name"] == "Desi Ghee"
    assert len(data["category_distribution"]) == 1
    assert data["category_distribution"][0]["food_count"] == 2


def test_admin_analytics_quiz():
    admin_headers = get_auth_headers(user_id=2)
    response = client.get("/api/admin/analytics/quiz", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_attempts"] == 2
    assert data["average_score"] == 90.0
    assert data["highest_score"] == 100.0
    assert len(data["score_distribution"]) == 5


def test_admin_analytics_users():
    admin_headers = get_auth_headers(user_id=2)
    response = client.get("/api/admin/analytics/users", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_users"] == 2
    assert data["admin_users_count"] == 1
    assert data["regular_users_count"] == 1
    assert len(data["registration_trend"]) >= 1
    assert len(data["recent_activity"]) >= 1


def test_admin_analytics_authorization_rejection():
    # Regular user attempting admin endpoint
    reg_headers = get_auth_headers(user_id=1)
    response = client.get("/api/admin/analytics/overview", headers=reg_headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Administrator access required for this operation"


def test_user_personal_analytics_privacy():
    reg_headers = get_auth_headers(user_id=1)
    response = client.get("/api/users/me/analytics", headers=reg_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_quizzes_attempted"] == 1
    assert data["average_quiz_score"] == 80.0
    assert data["best_quiz_score"] == 80.0
    assert data["favorite_foods_count"] == 1
