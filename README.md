# Logistics Microservices
Logistics Microservices app is a full-stack application for booking and tracking shipments using the Shippo API and adding packages to the weekly calendar. The frontend is built with Next.js (React) and Tailwind CSS, while the backend is a FastAPI application with a modular structure. The app is containerized using Docker and orchestrated with Docker Compose, making it easy to run locally or deploy.

# Features
## Shipment Booking
Create shipments by providing sender, receiver, and parcel details (/shipment-booking).

## Shipment Tracking
Track shipments using a tracking number (/order-tracking).

## Package Calendar
Add packages to the weekly calendar (Front-end only).

## API Authentication
Secure API endpoints with an X-API-Key header.

## CORS Support
Configurable Cross-Origin Resource Sharing for frontend-backend communication.

## Modular Backend
FastAPI backend organized into separate modules for routes, models, authentication, and configuration

# Prerequisites
## Docker
Install Docker Desktop (Windows/Mac) or Docker Engine (Linux).
https://docs.docker.com/get-started/get-docker/

## Docker Compose
Included with Docker Desktop or install separately on Linux.
https://docs.docker.com/compose/install/

## Node.js and npm
For local frontend development (optional if using Docker).
https://nodejs.org/en

## Python 3.11
For local backend development (optional if using Docker).
https://www.python.org/downloads/

# Project Setup
1. Clone the Repository
git clone https://github.com/yourusername/LOGISTICS-APP.git
cd LOGISTICS-APP

2. Configure Environment Variables
Create a .env file in the backend/ directory with the following:

SHIPPO_API_KEY=shippo_test_b0d2ab85b1ba800ca8cf2a58cc2e404eaf9f8a0d
INTERNAL_API_KEY=myTotalySecretKey
CORS_ORIGINS=http://localhost:3000
MOCK_TRACKING_NUMBER=SHIPPO_TRANSIT

Replace SHIPPO_API_KEY with your Shippo API key (or use the provided test key for development).
CORS_ORIGINS should match your frontend’s URL (e.g., http://localhost:3000).

3. Build and Run with Docker
Use Docker Compose to build and run both services

docker-compose up --build

Frontend: Runs on http://localhost:3000.
Backend: Runs on http://localhost:8000 (proxied internally by frontend).

# Usage
## Booking a Shipment
### Visit /shipment-booking.
Fill in the sender, receiver, and parcel details.
Submit to create a shipment—returns a tracking number and label URL (if successful).
Tracking a Shipment
### Visit /order-tracking.
Enter a tracking number (e.g., 123412341234).
Submit to view tracking details (mocked with SHIPPO_TRANSIT for now).


# License
This project is licensed under the MIT License—see the LICENSE file for details.

# Contact
For issues or questions, open an issue on GitHub or contact the maintainer at saad04534@live.com.
