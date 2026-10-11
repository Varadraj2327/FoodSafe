from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.database import get_db
from app.models.food import Food
from app.models.category import Category
from app.schemas.food import FoodResponse, FoodCreate, FoodUpdate
from app.core.deps import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/api/foods", tags=["Foods"])

@router.get("", response_model=List[FoodResponse])
def get_all_foods(db: Session = Depends(get_db)):
    """
    Retrieve all food commodity items with their associated category.
    """
    foods = db.scalars(
        select(Food).options(joinedload(Food.category)).order_by(Food.name)
    ).all()
    return foods

@router.get("/search", response_model=List[FoodResponse])
def search_foods(
    q: Optional[str] = Query(None, description="Case-insensitive search query for food name"),
    db: Session = Depends(get_db)
):
    """
    Search for food items by name using a case-insensitive query string.
    """
    if not q or not q.strip():
        return []

    search_term = f"%{q.strip()}%"
    foods = db.scalars(
        select(Food)
        .options(joinedload(Food.category))
        .where(Food.name.ilike(search_term))
        .order_by(Food.name)
    ).all()
    return foods

@router.get("/{food_id}", response_model=FoodResponse)
def get_food_by_id(food_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single food item by its unique ID.
    """
    food = db.scalar(
        select(Food).options(joinedload(Food.category)).where(Food.id == food_id)
    )
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food item not found"
        )
    food.view_count = (food.view_count or 0) + 1
    db.commit()
    db.refresh(food)
    return food

@router.post("", response_model=FoodResponse, status_code=status.HTTP_201_CREATED)
def create_food(
    food_in: FoodCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Create a new Food commodity. Admin protected endpoint.
    """
    category = db.scalar(select(Category).where(Category.id == food_in.category_id))
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with ID {food_in.category_id} does not exist"
        )
    
    food = Food(
        name=food_in.name.strip(),
        category_id=food_in.category_id,
        description=food_in.description.strip() if food_in.description else None,
        adulterants=food_in.adulterants.strip() if food_in.adulterants else None,
        health_risks=food_in.health_risks.strip() if food_in.health_risks else None,
        consumer_precautions=food_in.consumer_precautions.strip() if food_in.consumer_precautions else None,
        image_path=food_in.image_path.strip() if food_in.image_path else None,
    )
    db.add(food)
    db.commit()
    
    # Reload with category relationship
    created_food = db.scalar(
        select(Food).options(joinedload(Food.category)).where(Food.id == food.id)
    )
    return created_food

@router.put("/{food_id}", response_model=FoodResponse)
def update_food(
    food_id: int,
    food_in: FoodUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Update an existing Food commodity. Admin protected endpoint.
    """
    food = db.scalar(select(Food).where(Food.id == food_id))
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with ID {food_id} not found"
        )
    
    if food_in.category_id is not None:
        category = db.scalar(select(Category).where(Category.id == food_in.category_id))
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with ID {food_in.category_id} does not exist"
            )
        food.category_id = food_in.category_id

    if food_in.name is not None:
        food.name = food_in.name.strip()
    if food_in.description is not None:
        food.description = food_in.description.strip()
    if food_in.adulterants is not None:
        food.adulterants = food_in.adulterants.strip()
    if food_in.health_risks is not None:
        food.health_risks = food_in.health_risks.strip()
    if food_in.consumer_precautions is not None:
        food.consumer_precautions = food_in.consumer_precautions.strip()
    if food_in.image_path is not None:
        food.image_path = food_in.image_path.strip() if food_in.image_path else None

    db.commit()

    
    updated_food = db.scalar(
        select(Food).options(joinedload(Food.category)).where(Food.id == food_id)
    )
    return updated_food

@router.delete("/{food_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Delete a Food commodity. Admin protected endpoint.
    """
    food = db.scalar(select(Food).where(Food.id == food_id))
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with ID {food_id} not found"
        )
    
    db.delete(food)
    db.commit()
    return None
