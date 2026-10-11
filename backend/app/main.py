import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.database import initialize_database, get_db
from app.routers import (
    categories_router,
    foods_router,
    auth_router,
    admin_router,
    upload_router,
    users_router,
    favorites_router,
    quiz_router,
    analytics_router,
    contact_router,
)

# Configure Production-Ready Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("foodsafe")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing FoodSafe API backend service...")
    # Initialize database tables and seed default admin & commodities on startup
    initialize_database()
    logger.info("Database initialization completed successfully.")
    yield
    logger.info("Shutting down FoodSafe API backend service...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API service for FoodSafe — Food Adulteration Awareness System",
    lifespan=lifespan
)

# Enable CORS for frontend integration
origins = settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files Directory for Uploads
app.mount("/static/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Register API Routers
app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(foods_router)
app.include_router(admin_router)
app.include_router(upload_router)
app.include_router(users_router)
app.include_router(favorites_router)
app.include_router(quiz_router)
app.include_router(analytics_router)
app.include_router(contact_router)



@app.get("/")
def get_root():
    """Root status endpoint for monitoring and quick verification."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/health")
@app.get("/api/health")
def get_health(db: Session = Depends(get_db)):
    """
    Production health check endpoint returning service and database connectivity status.
    """
    db_status = "unhealthy"
    try:
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        logger.error(f"Healthcheck database connection error: {e}")

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_status
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
