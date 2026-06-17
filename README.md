# 🎬 MERN Movie Booking App (BookMyShow Clone)

A full-stack movie ticket booking application built with MERN stack, featuring Redis for seat locking and caching.

## 🚀 Features

- 🎟️ **Real-time Seat Booking** with Redis locks (5-minute timeout)
- 🎭 **Multi-tenant System** - Support multiple cinema chains
- 🍿 **Food & Beverage Ordering**
- 💳 **Multiple Payment Methods** (UPI, Card, Net Banking, Wallet)
- 🎫 **QR Code Tickets**
- ⭐ **Movie Reviews & Ratings**
- 🎁 **Discount Coupons & Offers**
- 📱 **Real-time Updates** via Socket.IO
- 🔍 **Advanced Filters** (Genre, Language, Format, City)
- 📊 **Analytics Dashboard**
- 🚀 **Redis Caching** for faster responses

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- Socket.IO Client

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (Seat Locking + Caching)
- Socket.IO
- JWT Authentication

**DevOps:**
- Docker & Docker Compose
- Kubernetes (K8s)
- GitHub Actions CI/CD
- Nginx

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- Docker Desktop
- Redis (via Docker)

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd Movie-Booking-App
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
echo PORT=5000 > .env
echo MONGO_URI=your_mongodb_uri >> .env
echo JWT_SECRET=your_jwt_secret >> .env
echo REDIS_URL=redis://localhost:6379 >> .env
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env.local file
echo VITE_API_URL=http://localhost:5000/api > .env.local
```

4. **Start Redis**
```bash
docker run -d --name redis -p 6379:6379 redis
```

5. **Run Application**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## 🐳 Docker Setup

```bash
# Start all services (Backend + Redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies (cached)
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/search?query=` - Search movies
- `POST /api/movies` - Create movie (Admin)

### Shows
- `GET /api/shows?city=&movieId=&date=` - Get shows
- `GET /api/shows/:id/seats` - Get seat availability (with Redis locks)
- `POST /api/shows` - Create show (Admin)

### Bookings
- `POST /api/bookings/lock-seat` - Lock seat (Redis 5-min lock)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Offers
- `GET /api/offers` - Get active offers
- `POST /api/offers/validate` - Validate offer code

### Food & Beverage
- `GET /api/food?theatreId=` - Get food items
- `POST /api/food` - Create food item (Admin)

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/movie/:movieId` - Get movie reviews

## 🔐 Redis Implementation

### Seat Locking Flow:
1. User selects seat → `POST /api/bookings/lock-seat`
2. Redis key: `seat:{showId}:{seatNumber}` → Expires in 5 minutes
3. Payment success → Confirm booking → Clear Redis lock
4. Lock expires → Seat becomes available again

### Movie Caching:
- Cache key: `movies:{status}:{genre}:{language}:{city}`
- TTL: 1 hour
- Auto-invalidation on updates

### Redis Commands:
```bash
# Check Redis status
docker ps -a --filter "name=redis"

# Access Redis CLI
docker exec -it redis redis-cli

# View all keys
KEYS *

# Check seat lock
GET seat:showId:A1
```

## 🚢 Deployment

### Kubernetes
```bash
cd k8s
kubectl apply -f .
```

### AWS EC2
```bash
# SSH to EC2 instance
cd ~/Movie-Booking-App
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

## 📊 Architecture

```
React Frontend (Port 5173)
    ↓
Express API (Port 5000)
    ↓
    ├→ Redis (Port 6379) ← Seat Locks + Cache
    └→ MongoDB Atlas     ← Permanent Data
```

## 📝 Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

```bash
# Test Redis connection
docker exec redis redis-cli ping
# Expected: PONG

# Test seat locking API
curl -X POST http://localhost:5000/api/bookings/lock-seat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"showId":"show123","seatNumber":"A1","userId":"user456"}'
```

## 📄 License

MIT License

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 👨‍💻 Author

Built with ❤️ for learning MERN stack development

---

For detailed feature documentation, see [BOOKMYSHOW_FEATURES.md](./BOOKMYSHOW_FEATURES.md)
