from fastapi import APIRouter, HTTPException, Depends
from shippo.models.errors import SDKError
from app.auth import require_api_key
from app.dependencies import get_shippo_and_mock
import logging
import re

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/{tracking_number}", response_model=dict)
def track_order(
    tracking_number: str,
    api_key: str = Depends(require_api_key),
    shippo_and_mock: tuple = Depends(get_shippo_and_mock)
):
    shippo_sdk, mock_tracking_number = shippo_and_mock
    if not re.match(r"^[A-Za-z0-9_-]+$", tracking_number):
        logger.warning("Invalid tracking number format: %s", tracking_number)
        raise HTTPException(status_code=400, detail="Invalid tracking number format")
    try:
        logger.info("Tracking request for %s (using mock %s)", tracking_number, mock_tracking_number)
        tracking = shippo_sdk.tracking_status.get(carrier="shippo", tracking_number=mock_tracking_number)
        response = {
            "carrier": tracking.carrier,
            "tracking_number": tracking_number,
            "status": tracking.tracking_status.status,
            "history": [
                {
                    "status": event.status,
                    "date": event.status_date,
                    "details": event.status_details,
                    "location": event.location or "Unknown"
                } for event in tracking.tracking_history
            ]
        }
        logger.info("Tracking response for %s: %s", tracking_number, response["status"])
        return response
    except SDKError as e:
        logger.error("Tracking error for %s: %s", tracking_number, e.__dict__)
        raise HTTPException(status_code=500, detail=f"Tracking error: {str(e)}")
    except Exception as e:
        logger.error("Unexpected tracking error for %s: %s", tracking_number, str(e))
        raise HTTPException(status_code=500, detail="Internal server error")