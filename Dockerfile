# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.5-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY . .
# Copy built frontend from previous stage to static resources
COPY --from=frontend-build /app/frontend/dist /app/backend/src/main/resources/static
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-focal

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy ML service files and install requirements
COPY ml-service/ ./ml-service/
RUN pip3 install --no-cache-dir -r ml-service/requirements.txt

# Copy built backend JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Copy and prepare startup script
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8080
ENTRYPOINT ["./start.sh"]
