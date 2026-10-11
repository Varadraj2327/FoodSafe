from typing import TYPE_CHECKING, Optional
from datetime import datetime
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.category import Category

class Food(Base):
    """
    Food commodity item model containing adulteration details, health risks, and test precautions.
    """
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False, index=True)
    
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    adulterants: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    health_risks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    consumer_precautions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Many-to-One Relationship with Category
    category: Mapped["Category"] = relationship(
        "Category",
        back_populates="foods"
    )
