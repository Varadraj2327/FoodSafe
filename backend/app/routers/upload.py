import os
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.core.deps import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/api/upload", tags=["File Uploads"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin)
):
    """
    Upload an image file for food commodities. Returns static asset URL.
    Protected endpoint requiring Admin privileges.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload payload"
        )

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image file format '{ext}'. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read content to check file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum 10MB limit"
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    relative_url = f"/static/uploads/{unique_filename}"
    return {
        "url": relative_url,
        "filename": unique_filename
    }
