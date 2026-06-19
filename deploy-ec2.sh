#!/bin/bash

echo "🚀 Movie Booking App - EC2 Deployment Fix"
echo "=========================================="

# Get EC2 public IP (or set manually)
EC2_IP="13.50.193.121"

echo -e "\n✅ Step 1: Updating frontend environment..."
echo "VITE_API_URL=http://${EC2_IP}:5000/api" > frontend/.env.local
echo "   → Frontend now points to: http://${EC2_IP}:5000/api"

echo -e "\n✅ Step 2: Adding ALLOWED_ORIGINS to backend..."
# Check if ALLOWED_ORIGINS exists in .env
if grep -q "ALLOWED_ORIGINS" backend/.env; then
  echo "   → ALLOWED_ORIGINS already exists in backend/.env"
else
  echo "ALLOWED_ORIGINS=http://${EC2_IP}:5173,http://localhost:5173" >> backend/.env
  echo "   → Added ALLOWED_ORIGINS to backend/.env"
fi

echo -e "\n✅ Step 3: Stopping containers..."
docker compose down

echo -e "\n✅ Step 4: Rebuilding images..."
docker compose build --no-cache

echo -e "\n✅ Step 5: Starting services..."
docker compose up -d

echo -e "\n⏳ Waiting for services to start..."
sleep 10

echo -e "\n✅ Step 6: Checking container status..."
docker ps

echo -e "\n✅ Step 7: Checking backend logs..."
docker compose logs backend --tail=30

echo -e "\n✅ Step 8: Testing API endpoint..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","phone":"1234567890"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | jq . || echo "Response received (jq not installed for pretty print)"

echo -e "\n=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo "Frontend: http://${EC2_IP}:5173"
echo "Backend:  http://${EC2_IP}:5000"
echo -e "\n📝 Next Steps:"
echo "1. Open http://${EC2_IP}:5173 in your browser"
echo "2. Try registering a new user"
echo "3. If issues persist, run: bash debug-backend.sh"
echo "=========================================="
