import logging
from fastapi import APIRouter, status
from app.schemas.contact import ContactMessageRequest, ContactMessageResponse

logger = logging.getLogger("foodsafe")
router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("", response_model=ContactMessageResponse, status_code=status.HTTP_200_OK)
def submit_contact_message(contact_data: ContactMessageRequest):
    """
    Accept and process public contact form submissions.
    """
    logger.info(f"Received contact message from '{contact_data.name}' ({contact_data.email}) - Subject: '{contact_data.subject}'")
    return ContactMessageResponse(
        status="success",
        message="Thank you for contacting FoodSafe! Your inquiry has been logged and our team will review it shortly."
    )
