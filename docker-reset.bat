@echo off

:: Stop and remove all containers defined in your docker-compose.yml
docker-compose down 

:: Prune all unused Docker images without confirmation
docker image prune -af

:: Start containers using Docker Compose
docker-compose up -d
