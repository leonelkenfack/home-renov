#!/bin/bash

# Define image and container names
IMAGE_NAME="home-renov-inc"
CONTAINER_NAME="home-renov-inc-container"

# Stop and remove any existing container with the same name
echo "--- Stopping and removing existing container..."
docker stop $CONTAINER_NAME >/dev/null 2>&1 || true
docker rm $CONTAINER_NAME >/dev/null 2>&1 || true

# Build the Docker image
echo "--- Building Docker image..."
docker build -t $IMAGE_NAME .

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "--- Docker build failed. Aborting."
    exit 1
fi

# Run the Docker container
echo "--- Starting new container on port 8086..."
docker run -d -p 8086:80 --env-file .env --name $CONTAINER_NAME $IMAGE_NAME

echo "---"
echo "--- Container started successfully!"
echo "--- Your application should now be available at http://localhost:8086"
echo "---" 