from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.food import FoodResponse

class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    food_id: int
    food: FoodResponse
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
