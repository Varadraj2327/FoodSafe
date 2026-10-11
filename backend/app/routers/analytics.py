from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, desc
from app.database import get_db
from app.models.user import User
from app.models.food import Food
from app.models.category import Category
from app.models.favorite import Favorite
from app.models.quiz_result import QuizResult
from app.core.deps import get_current_user, get_current_admin
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    FoodAnalyticsResponse,
    FoodPopularityItem,
    CategoryDistributionItem,
    QuizAnalyticsAdminResponse,
    QuizScoreDistributionItem,
    QuizPerformanceTrendItem,
    UserAnalyticsAdminResponse,
    UserRegistrationTrendItem,
    RecentActivityItem,
    UserPersonalInsightsResponse
)

router = APIRouter(tags=["Analytics Module"])

# ================================
# ADMIN ANALYTICS ENDPOINTS
# ================================

@router.get("/api/admin/analytics/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Returns high-level platform summary counts and averages.
    """
    total_users = db.scalar(select(func.count(User.id))) or 0
    total_foods = db.scalar(select(func.count(Food.id))) or 0
    total_categories = db.scalar(select(func.count(Category.id))) or 0
    total_quiz_attempts = db.scalar(select(func.count(QuizResult.id))) or 0
    avg_score = db.scalar(select(func.avg(QuizResult.percentage))) or 0.0
    total_favorites = db.scalar(select(func.count(Favorite.id))) or 0

    return AnalyticsOverviewResponse(
        total_users=total_users,
        total_foods=total_foods,
        total_categories=total_categories,
        total_quiz_attempts=total_quiz_attempts,
        average_quiz_score=round(avg_score, 2),
        total_favorites=total_favorites
    )


@router.get("/api/admin/analytics/foods", response_model=FoodAnalyticsResponse)
def get_food_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Returns most favorited foods, most viewed foods, and category breakdown.
    """
    # 1. Most Favorited Foods
    fav_query = (
        select(
            Food.id,
            Food.name,
            Category.name.label("category_name"),
            Food.view_count,
            func.count(Favorite.id).label("fav_count")
        )
        .join(Category, Food.category_id == Category.id)
        .join(Favorite, Favorite.food_id == Food.id)
        .group_by(Food.id, Food.name, Category.name, Food.view_count)
        .order_by(desc("fav_count"))
        .limit(5)
    )
    fav_results = db.execute(fav_query).all()
    most_favorited = [
        FoodPopularityItem(
            food_id=row.id,
            food_name=row.name,
            category_name=row.category_name,
            favorite_count=row.fav_count,
            view_count=row.view_count or 0
        )
        for row in fav_results
    ]

    # 2. Most Viewed Foods
    view_query = (
        select(Food)
        .options(joinedload(Food.category))
        .order_by(desc(Food.view_count))
        .limit(5)
    )
    viewed_foods = db.scalars(view_query).all()
    most_viewed = []
    for food in viewed_foods:
        fav_count = db.scalar(select(func.count(Favorite.id)).where(Favorite.food_id == food.id)) or 0
        most_viewed.append(
            FoodPopularityItem(
                food_id=food.id,
                food_name=food.name,
                category_name=food.category.name if food.category else "Uncategorized",
                favorite_count=fav_count,
                view_count=food.view_count or 0
            )
        )

    # 3. Category Distribution
    cat_query = (
        select(
            Category.id,
            Category.name,
            func.count(Food.id).label("food_count")
        )
        .outerjoin(Food, Food.category_id == Category.id)
        .group_by(Category.id, Category.name)
        .order_by(desc("food_count"))
    )
    cat_results = db.execute(cat_query).all()
    category_distribution = [
        CategoryDistributionItem(
            category_id=row.id,
            category_name=row.name,
            food_count=row.food_count
        )
        for row in cat_results
    ]

    return FoodAnalyticsResponse(
        most_favorited_foods=most_favorited,
        most_viewed_foods=most_viewed,
        category_distribution=category_distribution
    )


@router.get("/api/admin/analytics/quiz", response_model=QuizAnalyticsAdminResponse)
def get_admin_quiz_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Returns quiz score distributions and performance trends over time.
    """
    total_attempts = db.scalar(select(func.count(QuizResult.id))) or 0
    avg_score = db.scalar(select(func.avg(QuizResult.percentage))) or 0.0
    highest_score = db.scalar(select(func.max(QuizResult.percentage))) or 0.0

    # Score Distribution Buckets
    results = db.scalars(select(QuizResult)).all()
    b_0_20 = sum(1 for r in results if 0 <= r.percentage <= 20)
    b_21_40 = sum(1 for r in results if 21 <= r.percentage <= 40)
    b_41_60 = sum(1 for r in results if 41 <= r.percentage <= 60)
    b_61_80 = sum(1 for r in results if 61 <= r.percentage <= 80)
    b_81_100 = sum(1 for r in results if 81 <= r.percentage <= 100)

    score_distribution = [
        QuizScoreDistributionItem(score_range="0-20%", attempt_count=b_0_20),
        QuizScoreDistributionItem(score_range="21-40%", attempt_count=b_21_40),
        QuizScoreDistributionItem(score_range="41-60%", attempt_count=b_41_60),
        QuizScoreDistributionItem(score_range="61-80%", attempt_count=b_61_80),
        QuizScoreDistributionItem(score_range="81-100%", attempt_count=b_81_100),
    ]

    # Performance trend over time (group by date string YYYY-MM-DD)
    trend_dict = {}
    for r in results:
        date_str = r.completed_at.strftime("%Y-%m-%d") if r.completed_at else "Unknown"
        if date_str not in trend_dict:
            trend_dict[date_str] = []
        trend_dict[date_str].append(r.percentage)

    performance_over_time = [
        QuizPerformanceTrendItem(
            date=d,
            average_percentage=round(sum(scores) / len(scores), 2),
            total_attempts=len(scores)
        )
        for d, scores in sorted(trend_dict.items())
    ]

    return QuizAnalyticsAdminResponse(
        total_attempts=total_attempts,
        average_score=round(avg_score, 2),
        highest_score=round(highest_score, 2),
        score_distribution=score_distribution,
        performance_over_time=performance_over_time
    )


@router.get("/api/admin/analytics/users", response_model=UserAnalyticsAdminResponse)
def get_user_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Returns user growth statistics and recent platform activity feed.
    """
    total_users = db.scalar(select(func.count(User.id))) or 0
    admin_users_count = db.scalar(select(func.count(User.id)).where(User.is_admin == True)) or 0
    regular_users_count = total_users - admin_users_count

    # User registration trend
    all_users = db.scalars(select(User)).all()
    reg_dict = {}
    for u in all_users:
        date_str = u.created_at.strftime("%Y-%m-%d") if u.created_at else "Unknown"
        reg_dict[date_str] = reg_dict.get(date_str, 0) + 1

    registration_trend = [
        UserRegistrationTrendItem(date=d, new_users=cnt)
        for d, cnt in sorted(reg_dict.items())
    ]

    # Recent Activity Feed
    recent_activity: List[RecentActivityItem] = []
    
    # Add recent quiz attempts
    recent_quizzes = db.scalars(
        select(QuizResult).options(joinedload(QuizResult.user)).order_by(desc(QuizResult.completed_at)).limit(5)
    ).all()
    for q in recent_quizzes:
        recent_activity.append(
            RecentActivityItem(
                activity_type="quiz_attempt",
                description=f"Completed food safety quiz with score {q.score}/{q.total_questions} ({q.percentage}%)",
                timestamp=q.completed_at,
                user_name=q.user.full_name or q.user.username if q.user else "User"
            )
        )

    # Add recent user signups
    recent_signups = db.scalars(
        select(User).order_by(desc(User.created_at)).limit(5)
    ).all()
    for u in recent_signups:
        recent_activity.append(
            RecentActivityItem(
                activity_type="user_registered",
                description=f"New user account registered (@{u.username})",
                timestamp=u.created_at,
                user_name=u.full_name or u.username
            )
        )

    # Sort recent activity chronologically descending
    recent_activity.sort(key=lambda x: x.timestamp, reverse=True)
    recent_activity = recent_activity[:8]

    return UserAnalyticsAdminResponse(
        total_users=total_users,
        admin_users_count=admin_users_count,
        regular_users_count=regular_users_count,
        registration_trend=registration_trend,
        recent_activity=recent_activity
    )

# ================================
# USER PERSONAL INSIGHTS ENDPOINT
# ================================

@router.get("/api/users/me/analytics", response_model=UserPersonalInsightsResponse)
def get_user_personal_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Authenticated user endpoint: Returns personal learning insights, quiz scores, and favorites count.
    Users can ONLY view their own personal statistics.
    """
    user_results = db.scalars(
        select(QuizResult)
        .where(QuizResult.user_id == current_user.id)
        .order_by(QuizResult.completed_at.asc())
    ).all()

    total_quizzes = len(user_results)
    if total_quizzes > 0:
        avg_score = round(sum(r.percentage for r in user_results) / total_quizzes, 2)
        best_score = round(max(r.percentage for r in user_results), 2)
    else:
        avg_score = 0.0
        best_score = 0.0

    fav_count = db.scalar(
        select(func.count(Favorite.id)).where(Favorite.user_id == current_user.id)
    ) or 0

    # User score trend over time
    trend_dict = {}
    for r in user_results:
        date_str = r.completed_at.strftime("%Y-%m-%d") if r.completed_at else "Unknown"
        if date_str not in trend_dict:
            trend_dict[date_str] = []
        trend_dict[date_str].append(r.percentage)

    score_trend = [
        QuizPerformanceTrendItem(
            date=d,
            average_percentage=round(sum(scores) / len(scores), 2),
            total_attempts=len(scores)
        )
        for d, scores in sorted(trend_dict.items())
    ]

    return UserPersonalInsightsResponse(
        total_quizzes_attempted=total_quizzes,
        average_quiz_score=avg_score,
        best_quiz_score=best_score,
        favorite_foods_count=fav_count,
        score_trend=score_trend
    )
