from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.food import Food

class Favorite(Base):
    """
    User Favorite food item mapping model.
    """
    __tablename__ = "favorites"
    __table_args__ = (
        UniqueConstraint("user_id", "food_id", name="uq_user_food_favorite"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"), nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="favorites")
    food: Mapped["Food"] = relationship("Food")
