#!/bin/bash

# Start the ML Service (FastAPI) in the background
echo "Starting ML Service on port 8000..."
cd /app/ml-service && PORT=8000 python3 main.py &

# Wait for ML service to be ready
echo "Waiting for ML service..."
sleep 5

# Start the Java Backend (Spring Boot) in the foreground
echo "Starting Java Backend on port ${PORT:-8080}..."
cd /app && java -jar app.jar
