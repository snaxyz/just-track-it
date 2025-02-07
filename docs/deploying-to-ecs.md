# Deploying to ECS

## Prereqs

Make sure your service / app is able to build and run locally.

## Overview of steps

### 1. Create Elastic Container Repository (ECR) for the service

This is required to store your docker images

### 2. Create Docker file for service

Containerize your service into a docker image. Run the command:

```bash
docker build -t <tag> -f <Dockerfile_path> .

# example
docker build -t agent -f ./apps/agent/Dockerfile .
```

Ensure that it gets built correctly.

#### Test the image runs find locally

```bash
docker run -p <container_port>:<host_port> <tag>

# example
docker run -p 8080:8080 agent
```
