# Stage 1: Build the application
FROM maven:3.9.9-amazoncorretto-24 AS builder

# Set the working directory inside the builder container
WORKDIR /build

# Copy the Maven project files
COPY pom.xml ./
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM amazoncorretto:24-al2023-headless

# Set the working directory inside the runtime container
WORKDIR /app

# Copy the application JAR file from the builder stage
COPY --from=builder /build/target/iuticket-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the port the application runs on
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
