# Stage 1: Build everything via Maven (Multi-module)
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the entire project for the multi-module build
COPY . .

# Build the entire system (Frontend, Backend, and ML dependencies)
# frontend-maven-plugin will handle the React build automatically
RUN mvn clean install -DskipTests -DskipML=true -B

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-focal

# Install Python, pip, and curl for health checks
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built backend JAR from the backend module's target folder
COPY --from=build /app/backend/target/*.jar app.jar

# Install ML requirements
COPY ml-service/requirements.txt /app/ml-service/requirements.txt
RUN pip3 install --no-cache-dir -r /app/ml-service/requirements.txt

# Copy ML service code
COPY ml-service /app/ml-service

# Copy and prepare startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 8080 8000

# Use startup script
ENTRYPOINT ["/app/start.sh"]


