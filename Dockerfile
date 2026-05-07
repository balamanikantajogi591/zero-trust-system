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

# Copy pom.xml first to cache dependencies
COPY backend/pom.xml ./backend/
RUN mvn -f backend/pom.xml dependency:go-offline -B

# Copy backend source
COPY backend/src ./backend/src

# Copy built frontend from Stage 1 to static resources
# This ensures it's packaged into the JAR
COPY --from=frontend-build /app/frontend/dist ./backend/src/main/resources/static

# Build the JAR
WORKDIR /app/backend
ENV MAVEN_OPTS="-Xmx512m"
RUN mvn clean package -DskipTests -B

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-focal

# Install Python, pip, and curl for health checks
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built backend JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Install ML requirements first (optimized for memory/caching)
COPY ml-service/requirements.txt /app/ml-service/requirements.txt
RUN pip3 install --no-cache-dir --only-binary=:all: -r /app/ml-service/requirements.txt

# Copy ML service code
COPY ml-service /app/ml-service

# Copy and prepare startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 8080 8000

# Use startup script
ENTRYPOINT ["/app/start.sh"]


