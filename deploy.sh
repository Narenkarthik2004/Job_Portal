#!/bin/bash
chmod +x build.sh
./build.sh

docker build -t naren1023/project:latest .
docker login -u naren1023 -p Naren@2004
docker push naren1023/project:latest
