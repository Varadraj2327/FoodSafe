from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.category import CategoryResponse

class FoodBase(BaseModel):
    name: str
    category_id: int
    description: Optional[str] = None
    adulterants: Optional[str] = None
    health_risks: Optional[str] = None
    consumer_precautions: Optional[str] = None
    image_path: Optional[str] = None

class FoodCreate(FoodBase):
    pass

class FoodUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    adulterants: Optional[str] = None
    health_risks: Optional[str] = None
    consumer_precautions: Optional[str] = None
    image_path: Optional[str] = None

class FoodResponse(BaseModel):
    id: int
    name: str
    category: CategoryResponse
    description: Optional[str] = None
    adulterants: Optional[str] = None
    health_risks: Optional[str] = None
    consumer_precautions: Optional[str] = None
    image_path: Optional[str] = None
    view_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

