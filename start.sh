#!/bin/bash

# Start the ML Service (FastAPI) in the background
echo "Starting ML Service on port 8000..."
cd /app/ml-service
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 > ml_service.log 2>&1 &

# Wait for ML service to be ready
echo "Waiting for ML service to initialize..."
timeout 30 bash -c 'until curl -s http://127.0.0.1:8000/health > /dev/null; do sleep 2; done'
echo "ML service is up!"

# Start the Java Backend (Spring Boot) in the foreground
echo "Starting Java Backend on port ${PORT:-8080}..."
cd /app
exec java -jar app.jar
