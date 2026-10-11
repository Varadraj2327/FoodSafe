from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from app.database import get_db
from app.models.food import Food
from app.models.category import Category
from app.models.quiz_question import QuizQuestion
from app.models.user import User
from app.core.deps import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin)
):
    """
    Returns administrative statistics (food count, category count, quiz questions count).
    Protected endpoint requiring Admin JWT token.
    """
    food_count = db.scalar(select(func.count(Food.id))) or 0
    category_count = db.scalar(select(func.count(Category.id))) or 0
    quiz_count = db.scalar(select(func.count(QuizQuestion.id))) or 0

    return {
        "food_count": food_count,
        "category_count": category_count,
        "quiz_count": quiz_count,
        "admin_user": admin_user.username
    }
