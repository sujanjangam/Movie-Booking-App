#!/bin/bash

echo "🧹 Movie Booking App - Clean Restart Script"
echo "==========================================="

echo -e "\n✅ Step 1: Stopping all containers..."
docker compose down --remove-orphans --volumes

echo -e "\n✅ Step 2: Removing old images..."
docker compose rm -f

echo -e "\n✅ Step 3: Building fresh images..."
docker compose build --no-cache

echo -e "\n✅ Step 4: Starting services..."
docker compose up -d

echo -e "\n⏳ Waiting 15 seconds for services to initialize..."
sleep 15

echo -e "\n✅ Step 5: Checking container status..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n✅ Step 6: Backend logs..."
docker compose logs backend --tail=50

echo -e "\n✅ Step 7: Testing backend health..."
curl -s http://localhost:5000 | jq . || curl -s http://localhost:5000

echo -e "\n✅ Step 8: Testing registration endpoint..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test'$(date +%s)'@test.com","password":"Test123!","phone":"1234567890"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n==========================================="
echo "🎉 Restart Complete!"
echo "==========================================="
echo "Frontend: http://13.50.193.121:5173"
echo "Backend:  http://13.50.193.121:5000"
echo -e "\n📋 Container Status:"
docker compose ps
echo "==========================================="
