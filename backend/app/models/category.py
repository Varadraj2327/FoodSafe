from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.food import Food

class Category(Base):
    """
    Food Category model (e.g. Dairy, Spices, Oils & Fats, Grains & Pulses).
    """
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # One-to-Many Relationship with Food
    foods: Mapped[List["Food"]] = relationship(
        "Food",
        back_populates="category",
        cascade="all, delete-orphan"
    )
