from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LoginRequest(BaseModel):
    """
    Schema for JSON login requests.
    """
    username: str
    password: str

class RegisterRequest(BaseModel):
    """
    Schema for JSON user registration requests.
    """
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    full_name: Optional[str] = Field(None, max_length=100)

class TokenResponse(BaseModel):
    """
    Schema for JWT OAuth2 access token responses.
    """
    access_token: str
    token_type: str = "bearer"

