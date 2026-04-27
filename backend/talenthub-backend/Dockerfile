# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml file and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render automatically binds to the port the app uses, usually 8080)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
