from app.config import SHIPPO_API_KEY, MOCK_TRACKING_NUMBER
from shippo import Shippo

# Initialize Shippo SDK
shippo_sdk = Shippo(api_key_header=SHIPPO_API_KEY)

def get_shippo_and_mock():
    return shippo_sdk, MOCK_TRACKING_NUMBER