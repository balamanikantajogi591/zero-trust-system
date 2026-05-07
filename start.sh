#!/bin/bash

# Start the ML Service (FastAPI) in the background
echo "Starting ML Service on port 8000..."
cd /app/ml-service
PORT=8000 python3 main.py > ml_service.log 2>&1 &

# Wait for ML service to be ready
echo "Waiting for ML service to initialize..."
for i in {1..10}; do
    if curl -s http://localhost:8000/health > /dev/null; then
        echo "ML Service is healthy!"
        break
    fi
    echo "Still waiting for ML Service... ($i/10)"
    sleep 2
done

# Start the Java Backend (Spring Boot) in the foreground
echo "Starting Java Backend on port ${PORT:-8080}..."
cd /app
exec java -jar app.jar

