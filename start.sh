#!/bin/bash

# The ML Service has been decoupled and runs in its own Railway container.
# The Java Backend will connect to it using the APPLICATION_ML_SERVICE_URL environment variable.

# Start the Java Backend (Spring Boot) in the foreground
echo "Starting Java Backend on port ${PORT:-8080}..."
cd /app
exec java -jar app.jar

