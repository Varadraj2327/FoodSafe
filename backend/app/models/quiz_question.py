from typing import TYPE_CHECKING, Optional, List
from datetime import datetime
from sqlalchemy import Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.quiz_option import QuizOption

class QuizQuestion(Base):
    """
    Quiz question model for consumer food safety and adulteration awareness testing.
    """
    __tablename__ = "quiz_questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    options: Mapped[List["QuizOption"]] = relationship(
        "QuizOption",
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="QuizOption.id"
    )
