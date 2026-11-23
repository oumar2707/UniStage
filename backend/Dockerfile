# Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN useradd -r -u 1001 -g root appuser
COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:root app.jar
USER appuser

ENV PORT=8080
EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC -Xss512k -XX:TieredStopAtLevel=1"

ENTRYPOINT ["java", "-jar", "app.jar"]
