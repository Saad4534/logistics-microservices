from pydantic import BaseModel, Field
from typing import Optional
from shippo.models import components

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
    distance_unit: components.DistanceUnitEnum
    weight: str = Field(..., pattern=r"^\d+(\.\d+)?$")
    mass_unit: components.WeightUnitEnum

class ShipmentRequest(BaseModel):
    address_from: AddressRequest
    address_to: AddressRequest
    parcels: list[ParcelRequest]