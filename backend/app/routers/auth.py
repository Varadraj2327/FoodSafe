from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from app.database import get_db
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.schemas.auth import TokenResponse, LoginRequest, RegisterRequest
from app.schemas.user import UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new consumer user account and return a JWT access token.
    """
    username_clean = register_data.username.strip()
    email_clean = register_data.email.strip().lower()

    # Check for existing username
    existing_username = db.scalar(
        select(User).where(User.username == username_clean)
    )
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{username_clean}' is already taken. Please choose another."
        )

    # Check for existing email
    existing_email = db.scalar(
        select(User).where(User.email == email_clean)
    )
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email address '{email_clean}' is already registered."
        )

    # Hash password securely
    hashed_pwd = get_password_hash(register_data.password.strip())

    # Create new consumer user (is_admin=False explicitly)
    new_user = User(
        username=username_clean,
        email=email_clean,
        full_name=register_data.full_name.strip() if register_data.full_name and register_data.full_name.strip() else None,
        hashed_password=hashed_pwd,
        is_admin=False
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not complete user registration. Please try again."
        )

    access_token = create_access_token(subject=new_user.id)
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user credentials (username or email & password) and issue JWT token.
    """
    identifier = login_data.username.strip().lower()
    user = db.scalar(
        select(User).where(
            or_(User.username == login_data.username.strip(), User.email == identifier)
        )
    )
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve authenticated user profile information.
    """
    return current_user

