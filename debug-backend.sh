#!/bin/bash

echo "================================"
echo "🔍 Backend Diagnostics"
echo "================================"

echo -e "\n1️⃣ Checking Docker containers..."
docker ps

echo -e "\n2️⃣ Checking backend logs (last 50 lines)..."
docker compose logs backend --tail=50

echo -e "\n3️⃣ Testing backend API from localhost..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","phone":"1234567890"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n4️⃣ Checking backend environment variables..."
docker compose exec backend printenv | grep -E "MONGO_URI|PORT|REDIS_URL|CORS"

echo -e "\n5️⃣ Checking if backend port 5000 is listening..."
netstat -tlnp | grep 5000 || ss -tlnp | grep 5000

echo -e "\n6️⃣ Testing MongoDB connection..."
docker compose logs backend | grep -i "mongo\|database\|connection" | tail -20

echo -e "\n7️⃣ Testing Redis connection..."
docker compose logs backend | grep -i "redis" | tail -10

echo -e "\n================================"
echo "✅ Diagnostics Complete"
echo "================================"
