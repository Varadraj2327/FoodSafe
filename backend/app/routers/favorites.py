from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.database import get_db
from app.models.favorite import Favorite
from app.models.food import Food
from app.models.user import User
from app.schemas.food import FoodResponse
from app.schemas.favorite import FavoriteResponse
from app.core.deps import get_current_user

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])

@router.get("", response_model=List[FoodResponse])
def get_user_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all food commodities bookmarked as favorite by current user.
    """
    favs = db.scalars(
        select(Favorite)
        .where(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
    ).all()

    food_ids = [f.food_id for f in favs]
    if not food_ids:
        return []

    foods = db.scalars(
        select(Food)
        .options(joinedload(Food.category))
        .where(Food.id.in_(food_ids))
    ).all()

    # Reorder foods according to favorite creation order
    food_map = {f.id: f for f in foods}
    ordered_foods = [food_map[fid] for fid in food_ids if fid in food_map]
    return ordered_foods

@router.get("/check/{food_id}")
def check_favorite(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Check if a specific food item is in current user's favorites list.
    """
    fav = db.scalar(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.food_id == food_id
        )
    )
    return {"is_favorite": fav is not None}

@router.post("/{food_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add a food item to current user's favorites.
    """
    food = db.scalar(select(Food).where(Food.id == food_id))
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food commodity item #{food_id} not found"
        )

    existing = db.scalar(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.food_id == food_id
        )
    )
    if existing:
        return {"message": "Food item is already in favorites"}

    fav = Favorite(user_id=current_user.id, food_id=food_id)
    db.add(fav)
    db.commit()
    return {"message": f"Added '{food.name}' to favorites"}

@router.delete("/{food_id}", status_code=status.HTTP_200_OK)
def remove_favorite(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Remove a food item from current user's favorites.
    """
    fav = db.scalar(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.food_id == food_id
        )
    )
    if not fav:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite record not found"
        )

    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}
