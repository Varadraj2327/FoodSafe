from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class UserResponse(BaseModel):
    """
    Pydantic schema for returning User account data.
    """
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    is_admin: bool
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    """
    Pydantic schema for updating current user profile details.
    """
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

