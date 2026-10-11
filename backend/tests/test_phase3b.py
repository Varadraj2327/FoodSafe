import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import get_db, Base
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.models.quiz_question import QuizQuestion
from app.models.quiz_option import QuizOption

# Setup SQLite in-memory test database
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
    
    # Create Regular User
    regular_user = User(
        username="quizuser",
        email="quizuser@example.com",
        hashed_password=get_password_hash("password123"),
        is_admin=False
    )
    # Create Admin User
    admin_user = User(
        username="quizadmin",
        email="quizadmin@example.com",
        hashed_password=get_password_hash("admin123"),
        is_admin=True
    )
    db.add_all([regular_user, admin_user])
    db.commit()

    # Seed a quiz question
    q1 = QuizQuestion(
        question_text="How can you detect starch adulteration in milk?",
        explanation="Iodine turns blue when reacting with starch."
    )
    db.add(q1)
    db.flush()

    opt1 = QuizOption(question_id=q1.id, option_text="Add Iodine Solution", is_correct=True)
    opt2 = QuizOption(question_id=q1.id, option_text="Boil with Salt", is_correct=False)
    db.add_all([opt1, opt2])
    db.commit()

    yield
    db.close()
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.pop(get_db, None)


def get_auth_headers(username: str = "quizuser", user_id: int = 1, is_admin: bool = False):
    token = create_access_token(subject=user_id)
    return {"Authorization": f"Bearer {token}"}


def test_get_quiz_questions():
    response = client.get("/api/quiz/questions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["question_text"] == "How can you detect starch adulteration in milk?"
    # Verify is_correct is not leaked to user
    options = data[0]["options"]
    assert len(options) == 2
    assert "is_correct" not in options[0]


def test_admin_quiz_crud():
    admin_headers = get_auth_headers(username="quizadmin", user_id=2, is_admin=True)

    # 1. Admin GET questions (should include is_correct)
    res = client.get("/api/quiz/admin/questions", headers=admin_headers)
    assert res.status_code == 200
    questions = res.json()
    assert len(questions) >= 1
    assert "is_correct" in questions[0]["options"][0]

    # 2. Admin Create question
    create_payload = {
        "question_text": "What test reveals metanil yellow in turmeric?",
        "explanation": "Hydrochloric acid test produces magenta color.",
        "options": [
            {"option_text": "Concentrated HCl test", "is_correct": True},
            {"option_text": "Water solubility test", "is_correct": False}
        ]
    }
    create_res = client.post("/api/quiz/admin/questions", json=create_payload, headers=admin_headers)
    assert create_res.status_code == 201
    new_q = create_res.json()
    assert new_q["id"] is not None
    assert len(new_q["options"]) == 2

    # 3. Admin Update question
    update_payload = {
        "question_text": "What test reveals metanil yellow dye in turmeric?",
        "explanation": "HCl test produces distinct pinkish/magenta color.",
        "options": [
            {"option_text": "Concentrated HCl test", "is_correct": True},
            {"option_text": "Water solubility test", "is_correct": False},
            {"option_text": "Cold storage test", "is_correct": False}
        ]
    }
    update_res = client.put(f"/api/quiz/admin/questions/{new_q['id']}", json=update_payload, headers=admin_headers)
    assert update_res.status_code == 200
    updated_q = update_res.json()
    assert len(updated_q["options"]) == 3

    # 4. Admin Delete question
    del_res = client.delete(f"/api/quiz/admin/questions/{new_q['id']}", headers=admin_headers)
    assert del_res.status_code == 204


def test_quiz_submission_history_analytics():
    user_headers = get_auth_headers(username="quizuser", user_id=1, is_admin=False)

    # Get questions first
    q_res = client.get("/api/quiz/questions")
    questions = q_res.json()
    target_q = questions[0]
    correct_opt = [opt for opt in target_q["options"] if opt["option_text"] == "Add Iodine Solution"][0]

    # Submit answers
    submit_payload = {
        "answers": [
            {
                "question_id": target_q["id"],
                "selected_option_id": correct_opt["id"]
            }
        ]
    }
    sub_res = client.post("/api/quiz/submit", json=submit_payload, headers=user_headers)
    assert sub_res.status_code == 201
    result = sub_res.json()
    assert result["score"] == 1
    assert result["total_questions"] == 1
    assert result["percentage"] == 100.0
    assert len(result["details"]) == 1
    assert result["details"][0]["is_correct"] is True

    # Check History
    hist_res = client.get("/api/quiz/history", headers=user_headers)
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) == 1
    assert history[0]["percentage"] == 100.0

    # Check Analytics
    analytics_res = client.get("/api/quiz/analytics", headers=user_headers)
    assert analytics_res.status_code == 200
    analytics = analytics_res.json()
    assert analytics["total_attempts"] == 1
    assert analytics["average_score"] == 100.0
    assert analytics["performance_summary"]["total_quizzes_taken"] == 1
