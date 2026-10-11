from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from app.database import get_db
from app.models.user import User
from app.models.quiz_question import QuizQuestion
from app.models.quiz_option import QuizOption
from app.models.quiz_result import QuizResult
from app.schemas.quiz import (
    QuizQuestionUserResponse,
    QuizQuestionAdminResponse,
    QuizQuestionCreate,
    QuizQuestionUpdate,
    QuizSubmissionRequest,
    QuizResultResponse,
    QuestionResultDetail,
    QuizAnalyticsOverview,
    UserPerformanceSummary
)
from app.core.deps import get_current_user, get_current_admin

router = APIRouter(prefix="/api/quiz", tags=["Quiz & Awareness"])

# ================================
# USER ENDPOINTS
# ================================

@router.get("/questions", response_model=List[QuizQuestionUserResponse])
def get_quiz_questions(db: Session = Depends(get_db)):
    """
    Retrieve all food safety awareness questions for taking a quiz.
    Option correctness is excluded from payload to prevent client-side answer leakage.
    """
    questions = db.scalars(
        select(QuizQuestion).options(joinedload(QuizQuestion.options)).order_by(QuizQuestion.id)
    ).unique().all()
    return questions


@router.post("/submit", response_model=QuizResultResponse, status_code=status.HTTP_201_CREATED)
def submit_quiz_answers(
    submission: QuizSubmissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit user answers for a quiz attempt.
    Calculates total score, percentage, logs QuizResult, and returns detailed question breakdown.
    """
    if not submission.answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submission must contain at least one answer"
        )

    score = 0
    total_questions = len(submission.answers)
    details: List[QuestionResultDetail] = []

    for item in submission.answers:
        question = db.scalar(
            select(QuizQuestion)
            .options(joinedload(QuizQuestion.options))
            .where(QuizQuestion.id == item.question_id)
        )
        if not question:
            continue

        correct_opt = next((opt for opt in question.options if opt.is_correct), None)
        user_opt = next((opt for opt in question.options if opt.id == item.selected_option_id), None)

        user_opt_id = user_opt.id if user_opt else item.selected_option_id
        user_opt_text = user_opt.option_text if user_opt else "No option selected"
        correct_opt_id = correct_opt.id if correct_opt else 0
        correct_opt_text = correct_opt.option_text if correct_opt else "N/A"

        is_match = (user_opt is not None and correct_opt is not None and user_opt.id == correct_opt.id)
        if is_match:
            score += 1

        details.append(
            QuestionResultDetail(
                question_id=question.id,
                question_text=question.question_text,
                user_option_id=user_opt_id,
                user_option_text=user_opt_text,
                correct_option_id=correct_opt_id,
                correct_option_text=correct_opt_text,
                is_correct=is_match,
                explanation=question.explanation
            )
        )

    percentage = round((score / total_questions) * 100, 2) if total_questions > 0 else 0.0

    quiz_result = QuizResult(
        user_id=current_user.id,
        score=score,
        total_questions=total_questions,
        percentage=percentage
    )
    db.add(quiz_result)
    db.commit()
    db.refresh(quiz_result)

    return QuizResultResponse(
        id=quiz_result.id,
        score=quiz_result.score,
        total_questions=quiz_result.total_questions,
        percentage=quiz_result.percentage,
        completed_at=quiz_result.completed_at,
        details=details
    )


@router.get("/history", response_model=List[QuizResultResponse])
def get_quiz_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve previous quiz attempts for the authenticated user.
    """
    results = db.scalars(
        select(QuizResult)
        .where(QuizResult.user_id == current_user.id)
        .order_by(QuizResult.completed_at.desc())
    ).all()
    return results


@router.get("/analytics", response_model=QuizAnalyticsOverview)
def get_quiz_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve overall platform quiz analytics and personal performance summary.
    """
    # Overall aggregate analytics
    total_attempts = db.scalar(select(func.count(QuizResult.id))) or 0
    avg_score_val = db.scalar(select(func.avg(QuizResult.percentage))) or 0.0
    unique_users = db.scalar(select(func.count(func.distinct(QuizResult.user_id)))) or 0

    # User personal performance
    user_results = db.scalars(
        select(QuizResult)
        .where(QuizResult.user_id == current_user.id)
        .order_by(QuizResult.completed_at.desc())
    ).all()

    user_attempts_count = len(user_results)
    if user_attempts_count > 0:
        user_avg = round(sum(r.percentage for r in user_results) / user_attempts_count, 2)
        user_high = max(r.percentage for r in user_results)
        latest_date = user_results[0].completed_at
    else:
        user_avg = 0.0
        user_high = 0.0
        latest_date = None

    return QuizAnalyticsOverview(
        total_attempts=total_attempts,
        average_score=round(avg_score_val, 2),
        total_unique_participants=unique_users,
        performance_summary=UserPerformanceSummary(
            total_quizzes_taken=user_attempts_count,
            average_score_percentage=user_avg,
            highest_score_percentage=user_high,
            latest_quiz_date=latest_date
        )
    )

# ================================
# ADMIN CRUD ENDPOINTS
# ================================

@router.get("/admin/questions", response_model=List[QuizQuestionAdminResponse])
def get_admin_quiz_questions(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Retrieve all questions including answer key correctness flags.
    """
    questions = db.scalars(
        select(QuizQuestion).options(joinedload(QuizQuestion.options)).order_by(QuizQuestion.id)
    ).unique().all()
    return questions


@router.post("/admin/questions", response_model=QuizQuestionAdminResponse, status_code=status.HTTP_201_CREATED)
def create_quiz_question(
    q_in: QuizQuestionCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Create a new quiz question with multiple choice options.
    """
    has_correct = any(opt.is_correct for opt in q_in.options)
    if not has_correct:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one option must be marked as correct (is_correct=true)"
        )

    question = QuizQuestion(
        question_text=q_in.question_text.strip(),
        explanation=q_in.explanation.strip() if q_in.explanation else None
    )
    db.add(question)
    db.flush()

    for opt_in in q_in.options:
        opt = QuizOption(
            question_id=question.id,
            option_text=opt_in.option_text.strip(),
            is_correct=opt_in.is_correct
        )
        db.add(opt)

    db.commit()

    created_q = db.scalar(
        select(QuizQuestion)
        .options(joinedload(QuizQuestion.options))
        .where(QuizQuestion.id == question.id)
    )
    return created_q


@router.put("/admin/questions/{question_id}", response_model=QuizQuestionAdminResponse)
def update_quiz_question(
    question_id: int,
    q_in: QuizQuestionUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Update an existing quiz question and replace options.
    """
    question = db.scalar(select(QuizQuestion).where(QuizQuestion.id == question_id))
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quiz question with ID {question_id} not found"
        )

    if q_in.question_text is not None:
        question.question_text = q_in.question_text.strip()
    if q_in.explanation is not None:
        question.explanation = q_in.explanation.strip() if q_in.explanation else None

    if q_in.options is not None:
        if not any(opt.is_correct for opt in q_in.options):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one option must be marked as correct (is_correct=true)"
            )
        # Delete old options
        db.query(QuizOption).filter(QuizOption.question_id == question_id).delete()
        db.flush()

        for opt_in in q_in.options:
            opt = QuizOption(
                question_id=question.id,
                option_text=opt_in.option_text.strip(),
                is_correct=opt_in.is_correct
            )
            db.add(opt)

    db.commit()

    updated_q = db.scalar(
        select(QuizQuestion)
        .options(joinedload(QuizQuestion.options))
        .where(QuizQuestion.id == question_id)
    )
    return updated_q


@router.delete("/admin/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Admin endpoint: Delete a quiz question and its options.
    """
    question = db.scalar(select(QuizQuestion).where(QuizQuestion.id == question_id))
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quiz question with ID {question_id} not found"
        )

    db.delete(question)
    db.commit()
    return None
