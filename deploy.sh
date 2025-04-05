#!/bin/bash
echo "[DEPLOY] Running build script..."
chmod +x build.sh
./build.sh

echo "[DEPLOY] Building Docker image..."
docker build -t naren1023/project:latest .

echo "[DEPLOY] Logging in to Docker Hub..."
docker login -u naren1023 -p Naren@2004

echo "[DEPLOY] Pushing image to Docker Hub..."
docker push naren1023/project:latest
