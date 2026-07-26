# --- Stage 1: Build JAR inside Docker ---
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Minimal Runtime Stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copies the explicitly named target/Safe-Circle.jar from Stage 1
COPY --from=builder /app/target/Safe-Circle.jar Safe-Circle.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "Safe-Circle.jar"]