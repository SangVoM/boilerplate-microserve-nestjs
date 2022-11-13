#!/bin/sh

echo 'Create boilerplate-microservice-network network...'

docker network create boilerplate-microservice-network || true

echo 'Setting software'
docker compose up -d
echo 'Install api-gateway'
cd api-gateway && docker compose up -d
cd ..
echo 'Install app-service'
cd app-service && docker compose up -d
