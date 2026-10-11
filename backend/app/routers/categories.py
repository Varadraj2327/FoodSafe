from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse, CategoryCreate, CategoryUpdate
from app.core.deps import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    """
    Retrieve all food categories. Public endpoint.
    """
    categories = db.scalars(
        select(Category).order_by(Category.name)
    ).all()
    return categories

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Create a new Category. Admin protected endpoint.
    """
    existing = db.scalar(
        select(Category).where(Category.name == category_in.name.strip())
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{category_in.name}' already exists"
        )
    
    category = Category(
        name=category_in.name.strip(),
        description=category_in.description.strip() if category_in.description else None
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Update an existing Category. Admin protected endpoint.
    """
    category = db.scalar(select(Category).where(Category.id == category_id))
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found"
        )
    
    if category_in.name is not None:
        name_str = category_in.name.strip()
        existing = db.scalar(
            select(Category).where(Category.name == name_str, Category.id != category_id)
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with name '{name_str}' already exists"
            )
        category.name = name_str

    if category_in.description is not None:
        category.description = category_in.description.strip()

    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Delete a Category. Admin protected endpoint.
    """
    category = db.scalar(select(Category).where(Category.id == category_id))
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found"
        )
    
    db.delete(category)
    db.commit()
    return None
