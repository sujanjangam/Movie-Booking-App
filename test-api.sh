#!/bin/bash

echo "🧪 Testing Backend API Endpoints"
echo "================================"

BASE_URL="http://localhost:5000"

echo -e "\n1️⃣ Testing root endpoint..."
curl -s ${BASE_URL} | jq . || curl -s ${BASE_URL}

echo -e "\n\n2️⃣ Testing registration endpoint..."
curl -X POST ${BASE_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test'$(date +%s)'@example.com","password":"Test123!","phone":"1234567890"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq . || echo "API responded"

echo -e "\n\n3️⃣ Testing login endpoint..."
curl -X POST ${BASE_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo -e "\n\n4️⃣ Testing movies endpoint..."
curl -s ${BASE_URL}/api/movies?status=now_showing | head -c 200

echo -e "\n\n================================"
echo "✅ API Test Complete"
echo "================================"
