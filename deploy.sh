#!/bin/bash
    sh 'chmod +x build.sh'
    sh './build.sh'
    docker login -u naren1023 -p Naren@2004
    docker tag test naren1023/project
    docker push naren1023/project

    
