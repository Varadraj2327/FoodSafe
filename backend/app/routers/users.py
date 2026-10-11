from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.core.deps import get_current_user
from app.core.security import get_password_hash

router = APIRouter(prefix="/api/users", tags=["Users & Profiles"])

@router.get("/me", response_model=UserResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve authenticated user profile information (display name, email, join date).
    """
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update authenticated user profile (full_name, email, password).
    """
    if user_update.email is not None:
        new_email = user_update.email.strip().lower()
        if new_email != current_user.email:
            existing = db.scalar(
                select(User).where(User.email == new_email, User.id != current_user.id)
            )
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Email address '{new_email}' is already registered to another account"
                )
            current_user.email = new_email

    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name.strip() if user_update.full_name.strip() else None

    if user_update.password is not None and user_update.password.strip():
        if len(user_update.password.strip()) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 6 characters in length"
            )
        current_user.hashed_password = get_password_hash(user_update.password.strip())

    db.commit()
    db.refresh(current_user)
    return current_user
