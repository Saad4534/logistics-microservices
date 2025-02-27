import os
from dotenv import load_dotenv

load_dotenv()

# Environment variables
SHIPPO_API_KEY = os.getenv("SHIPPO_API_KEY")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
MOCK_TRACKING_NUMBER = os.getenv("MOCK_TRACKING_NUMBER", "SHIPPO_TRANSIT")

# Validate critical variables
if not SHIPPO_API_KEY:
    raise RuntimeError("SHIPPO_API_KEY is required")
if not INTERNAL_API_KEY:
    raise RuntimeError("INTERNAL_API_KEY is required")