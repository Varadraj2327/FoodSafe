from pydantic import BaseModel, EmailStr, Field

class ContactMessageRequest(BaseModel):
    """
    Schema for contact form submissions.
    """
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=10, max_length=2000)

class ContactMessageResponse(BaseModel):
    """
    Schema for contact submission API response.
    """
    status: str = "success"
    message: str
