from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

# Option Schemas
class QuizOptionBase(BaseModel):
    option_text: str = Field(..., min_length=1, max_length=255)

class QuizOptionUserResponse(QuizOptionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class QuizOptionAdminResponse(QuizOptionBase):
    id: int
    is_correct: bool
    model_config = ConfigDict(from_attributes=True)

class QuizOptionCreate(QuizOptionBase):
    is_correct: bool = False

# Question Schemas
class QuizQuestionUserResponse(BaseModel):
    id: int
    question_text: str
    options: List[QuizOptionUserResponse]
    model_config = ConfigDict(from_attributes=True)

class QuizQuestionAdminResponse(BaseModel):
    id: int
    question_text: str
    explanation: Optional[str] = None
    created_at: Optional[datetime] = None
    options: List[QuizOptionAdminResponse]
    model_config = ConfigDict(from_attributes=True)

class QuizQuestionCreate(BaseModel):
    question_text: str = Field(..., min_length=3)
    explanation: Optional[str] = None
    options: List[QuizOptionCreate] = Field(..., min_length=2)

class QuizQuestionUpdate(BaseModel):
    question_text: Optional[str] = Field(None, min_length=3)
    explanation: Optional[str] = None
    options: Optional[List[QuizOptionCreate]] = None

# Submission & Results Schemas
class QuizAnswerInput(BaseModel):
    question_id: int
    selected_option_id: int

class QuizSubmissionRequest(BaseModel):
    answers: List[QuizAnswerInput]

class QuestionResultDetail(BaseModel):
    question_id: int
    question_text: str
    user_option_id: int
    user_option_text: str
    correct_option_id: int
    correct_option_text: str
    is_correct: bool
    explanation: Optional[str] = None

class QuizResultResponse(BaseModel):
    id: int
    score: int
    total_questions: int
    percentage: float
    completed_at: datetime
    details: Optional[List[QuestionResultDetail]] = None
    model_config = ConfigDict(from_attributes=True)

# Analytics Schemas
class UserPerformanceSummary(BaseModel):
    total_quizzes_taken: int
    average_score_percentage: float
    highest_score_percentage: float
    latest_quiz_date: Optional[datetime] = None

class QuizAnalyticsOverview(BaseModel):
    total_attempts: int
    average_score: float
    total_unique_participants: int
    performance_summary: UserPerformanceSummary
