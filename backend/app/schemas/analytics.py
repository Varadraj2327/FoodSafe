from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class AnalyticsOverviewResponse(BaseModel):
    total_users: int
    total_foods: int
    total_categories: int
    total_quiz_attempts: int
    average_quiz_score: float
    total_favorites: int

class FoodPopularityItem(BaseModel):
    food_id: int
    food_name: str
    category_name: str
    favorite_count: int
    view_count: int

class CategoryDistributionItem(BaseModel):
    category_id: int
    category_name: str
    food_count: int

class FoodAnalyticsResponse(BaseModel):
    most_favorited_foods: List[FoodPopularityItem]
    most_viewed_foods: List[FoodPopularityItem]
    category_distribution: List[CategoryDistributionItem]

class QuizScoreDistributionItem(BaseModel):
    score_range: str
    attempt_count: int

class QuizPerformanceTrendItem(BaseModel):
    date: str
    average_percentage: float
    total_attempts: int

class QuizAnalyticsAdminResponse(BaseModel):
    total_attempts: int
    average_score: float
    highest_score: float
    score_distribution: List[QuizScoreDistributionItem]
    performance_over_time: List[QuizPerformanceTrendItem]

class UserRegistrationTrendItem(BaseModel):
    date: str
    new_users: int

class RecentActivityItem(BaseModel):
    activity_type: str
    description: str
    timestamp: datetime
    user_name: Optional[str] = None

class UserAnalyticsAdminResponse(BaseModel):
    total_users: int
    admin_users_count: int
    regular_users_count: int
    registration_trend: List[UserRegistrationTrendItem]
    recent_activity: List[RecentActivityItem]

class UserPersonalInsightsResponse(BaseModel):
    total_quizzes_attempted: int
    average_quiz_score: float
    best_quiz_score: float
    favorite_foods_count: int
    score_trend: List[QuizPerformanceTrendItem]
