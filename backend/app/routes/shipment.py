from fastapi import APIRouter, HTTPException, Depends
from shippo.models import components
from shippo.models.errors import SDKError
from app.models import ShipmentRequest
from app.auth import require_api_key
from app.dependencies import shippo_sdk
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("", response_model=dict)
def create_order(
    request: ShipmentRequest,
    api_key: str = Depends(require_api_key),
    shippo_sdk=Depends(lambda: shippo_sdk)  # Already imported from dependencies
):
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
        logger.error("Shippo API error: %s", e.__dict__)
        raise HTTPException(status_code=500, detail=f"API Error: {str(e)}")
    except HTTPException as e:
        raise e
    except ValueError as e:
        logger.error("Validation error: %s", str(e))
        raise HTTPException(status_code=400, detail=f"Validation Error: {str(e)}")
    except Exception as e:
        logger.error("Unexpected error: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")