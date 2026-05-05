FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY pom.xml .
COPY src ./src

# This would ideally use a multi-stage build with Maven, but we assume
# the jar is built before running docker-compose in a real env or we use Maven wrapper.
# Since we didn't scaffold the Maven wrapper (.mvn), we will install maven in the container for simplicity in dev.

RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

# Copy the built jar
RUN cp target/security-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
