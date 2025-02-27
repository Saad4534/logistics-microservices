from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import APIKeyHeader
from shippo import Shippo
from shippo.models import components
from shippo.models.errors import SDKError
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv
from typing import Optional
import re

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Shipping API",
    description="API for creating and tracking shipments using Shippo",
    version="1.0.0"
)

SHIPPO_API_KEY = os.getenv("SHIPPO_API_KEY")
if not SHIPPO_API_KEY:
    logger.error("SHIPPO_API_KEY not set in environment variables")
    raise RuntimeError("SHIPPO_API_KEY is required")

shippo_sdk = Shippo(api_key_header=SHIPPO_API_KEY)

MOCK_TRACKING_NUMBER = "SHIPPO_TRANSIT"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AddressRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    street1: str = Field(..., min_length=1, max_length=100)
    street2: Optional[str] = Field(None, max_length=100)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=2, max_length=2)
    zip: str = Field(..., pattern=r"^\d{5}(-\d{4})?$")
    country: str = Field(..., min_length=2, max_length=2)
    phone: Optional[str] = Field(None, pattern=r"^\+?\d{10,15}$")
    email: Optional[str] = Field(None, max_length=100)

class ParcelRequest(BaseModel):
    length: str = Field(..., pattern=r"^\d+(\.\d+)?$")
    width: str = Field(..., pattern=r"^\d+(\.\d+)?$")
    height: str = Field(..., pattern=r"^\d+(\.\d+)?$")
    distance_unit: components.DistanceUnitEnum  # Updated from DistanceUnitEnum
    weight: str = Field(..., pattern=r"^\d+(\.\d+)?$")
    mass_unit: components.WeightUnitEnum  # Updated from WeightUnitEnum

class ShipmentRequest(BaseModel):
    address_from: AddressRequest
    address_to: AddressRequest
    parcels: list[ParcelRequest]

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def require_api_key(api_key: str = Depends(api_key_header)):
    if not api_key or api_key != os.getenv("INTERNAL_API_KEY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing API key"
        )
    return api_key

@app.post("/create-order", response_model=dict, dependencies=[Depends(require_api_key)])
def create_order(request: ShipmentRequest):
    try:
        address_from = components.AddressCreateRequest(
            name=request.address_from.name,
            street1=request.address_from.street1,
            street2=request.address_from.street2,
            city=request.address_from.city,
            state=request.address_from.state,
            zip=request.address_from.zip,
            country=request.address_from.country,
            phone=request.address_from.phone,
            email=request.address_from.email
        )

        address_to = components.AddressCreateRequest(
            name=request.address_to.name,
            street1=request.address_to.street1,
            street2=request.address_to.street2,
            city=request.address_to.city,
            state=request.address_to.state,
            zip=request.address_to.zip,
            country=request.address_to.country,
            phone=request.address_to.phone,
            email=request.address_to.email
        )

        parcel_data = request.parcels[0]
        parcel = components.ParcelCreateRequest(
            length=parcel_data.length,
            width=parcel_data.width,
            height=parcel_data.height,
            distance_unit=parcel_data.distance_unit,
            weight=parcel_data.weight,
            mass_unit=parcel_data.mass_unit
        )

        logger.info("Creating shipment from %s to %s", address_from.city, address_to.city)
        shipment = shippo_sdk.shipments.create(
            components.ShipmentCreateRequest(
                address_from=address_from,
                address_to=address_to,
                parcels=[parcel],
                async_=False
            )
        )

        if not shipment.rates:
            logger.warning("No rates available for shipment %s", shipment.object_id)
            raise HTTPException(status_code=400, detail="No rates available for this shipment")

        rates = [f"{r.provider}: {r.amount} {r.currency}" for r in shipment.rates]
        logger.info("Rates available: %s", rates)

        rate = next((r for r in shipment.rates if r.provider == "USPS"), shipment.rates[0])

        logger.info("Creating transaction with rate %s", rate.object_id)
        transaction = shippo_sdk.transactions.create(
            components.TransactionCreateRequest(
                rate=rate.object_id,
                label_file_type="PDF",
                async_=False
            )
        )

        response_data = {
            "shipment_object_id": shipment.object_id,
            "transaction_status": transaction.status,
        }

        if transaction.status == "SUCCESS":
            response_data["tracking_number"] = transaction.tracking_number
            response_data["label_url"] = transaction.label_url
            logger.info("Transaction successful. Tracking: %s, Label: %s",
                       transaction.tracking_number, transaction.label_url)
        else:
            messages = [msg.to_dict() for msg in transaction.messages] if transaction.messages else []
            logger.error("Transaction failed: %s", messages)
            response_data["error"] = "Transaction failed"
            response_data["messages"] = messages
            raise HTTPException(status_code=400, detail={"error": "Transaction failed", "messages": messages})

        return response_data

    except SDKError as e:
        logger.error("Shippo API error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"API Error: {str(e)}")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error("Unexpected error: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/track/{tracking_number}", response_model=dict, dependencies=[Depends(require_api_key)])
def track_order(tracking_number: str):
    if not re.match(r"^[A-Za-z0-9_-]+$", tracking_number):
        logger.warning("Invalid tracking number format: %s", tracking_number)
        raise HTTPException(status_code=400, detail="Invalid tracking number format")

    try:
        logger.info("Tracking request for %s (using mock %s)", tracking_number, MOCK_TRACKING_NUMBER)
        tracking = shippo_sdk.tracking_status.get(carrier="shippo", tracking_number=MOCK_TRACKING_NUMBER)

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
        logger.error("Tracking error for %s: %s", tracking_number, str(e))
        raise HTTPException(status_code=500, detail=f"Tracking error: {str(e)}")
    except Exception as e:
        logger.error("Unexpected tracking error for %s: %s", tracking_number, str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)