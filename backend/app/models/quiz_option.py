from typing import TYPE_CHECKING
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.quiz_question import QuizQuestion

class QuizOption(Base):
    """
    Option choice model associated with a specific QuizQuestion.
    """
    __tablename__ = "quiz_options"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    question_id: Mapped[int] = mapped_column(
        ForeignKey("quiz_questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    option_text: Mapped[str] = mapped_column(String(255), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationship
    question: Mapped["QuizQuestion"] = relationship("QuizQuestion", back_populates="options")
