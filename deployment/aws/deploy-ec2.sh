#!/bin/bash
# AWS EC2 Ubuntu Deployment Automation Script for RetailOrderManagementSystem

set -e

echo "=== Updating Ubuntu Packages & Installing Java 21 & Docker ==="
sudo apt-get update -y
sudo apt-get install -y openjdk-21-jdk docker.io docker-compose-v2 nginx git curl

echo "=== Starting & Enabling Services ==="
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl enable nginx

echo "=== Creating Deployment Directory ==="
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

echo "=== Building Docker Containers (App + MySQL + Kafka) ==="
sudo docker compose up -d --build

echo "=== Configuring Nginx Reverse Proxy ==="
sudo cp /home/ubuntu/app/deployment/aws/nginx.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl restart nginx

echo "=== Deployment Completed Successfully! ==="
echo "Application running at http://$(curl -s ifconfig.me):8080"
