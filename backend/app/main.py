from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn
from app.config import CORS_ORIGINS
from app.routes.shipment import create_order, router as shipment_router
from app.routes.tracking import track_order, router as tracking_router
from app.dependencies import shippo_sdk

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# FastAPI app setup
app = FastAPI(
    title="Shipping API",
    description="API for creating and tracking shipments using Shippo",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(shipment_router, prefix="/create-order")
app.include_router(tracking_router, prefix="/track")

# Register endpoints directly with dependencies
app.post("/create-order", response_model=dict)(create_order)
app.get("/track/{tracking_number}", response_model=dict)(track_order)

# For local testing
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)