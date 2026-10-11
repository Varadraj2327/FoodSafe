from app.routers.categories import router as categories_router
from app.routers.foods import router as foods_router
from app.routers.auth import router as auth_router
from app.routers.admin import router as admin_router
from app.routers.upload import router as upload_router
from app.routers.users import router as users_router
from app.routers.favorites import router as favorites_router
from app.routers.quiz import router as quiz_router
from app.routers.analytics import router as analytics_router
from app.routers.contact import router as contact_router

__all__ = [
    "categories_router",
    "foods_router",
    "auth_router",
    "admin_router",
    "upload_router",
    "users_router",
    "favorites_router",
    "quiz_router",
    "analytics_router",
    "contact_router"
]



