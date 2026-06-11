# 🚀 Quick Start Guide - BookMyShow Features

## Phase 1: Backend Enhancement (COMPLETED ✅)

### What's Been Added?

1. ✅ Enhanced Models (Movie, Show, Theatre, Booking, User)
2. ✅ New Models (Offer, Review, FoodItem)
3. ✅ New Controllers (offerController, foodController, reviewController)
4. ✅ New Routes (offer, food, review)
5. ✅ Migration Scripts
6. ✅ Sample Data Seeder

---

## 📦 Installation & Setup

### Step 1: Update Dependencies (if needed)
```bash
cd backend
npm install
```

### Step 2: Run Migration Scripts
```bash
# Migrate existing movies
node migrateMoviesV3.js

# Migrate existing theatres  
node migrateTheatresV3.js

# Migrate existing shows
node migrateShowsV3.js
```

### Step 3: Seed Sample Data (Optional)
```bash
# Add sample movies, offers, and food items
node seedBookMyShowData.js
```

### Step 4: Start the Server
```bash
npm run dev
# or
npm start
```

---

## 🧪 Testing New Endpoints

### Test Movie Filters
```bash
# Get all movies
GET http://13.51.92.162:5000/api/movies

# Get movies by status
GET http://13.51.92.162:5000/api/movies/status/NOW_SHOWING
GET http://13.51.92.162:5000/api/movies/status/COMING_SOON

# Search movies
GET http://13.51.92.162:5000/api/movies/search?query=batman

# Filter by genre/language
GET http://13.51.92.162:5000/api/movies?genre=Action&language=Hindi
```

### Test Offers
```bash
# Get active offers
GET http://13.51.92.162:5000/api/offers

# Validate offer code
POST http://13.51.92.162:5000/api/offers/validate
{
  "code": "FIRST100",
  "bookingAmount": 500,
  "applicableOn": "MOVIES"
}
```

### Test Food Items
```bash
# Get all food items
GET http://13.51.92.162:5000/api/food

# Get by category
GET http://13.51.92.162:5000/api/food/category/POPCORN
GET http://13.51.92.162:5000/api/food/category/COMBO
```

### Test Reviews
```bash
# Get movie reviews
GET http://13.51.92.162:5000/api/reviews/movie/:movieId

# Create review
POST http://13.51.92.162:5000/api/reviews
{
  "movieId": "...",
  "rating": 9,
  "title": "Amazing movie!",
  "review": "One of the best movies I've seen..."
}
```

---

## 🎨 Enhanced Movie Data Structure

### Example Movie Object:
```json
{
  "title": "Inception",
  "description": "A thief who steals corporate secrets...",
  "poster": "https://...",
  "banner": "https://...",
  "trailer": "https://youtube.com/...",
  "duration": "2h 28m",
  "language": ["English", "Hindi", "Tamil"],
  "genre": ["Action", "Sci-Fi", "Thriller"],
  "rating": 8.8,
  "votes": 25000,
  "certificate": "UA",
  "releaseDate": "2010-07-16",
  "format": ["2D", "IMAX"],
  "cast": [
    { "name": "Leonardo DiCaprio", "role": "Cobb" }
  ],
  "crew": [
    { "name": "Christopher Nolan", "role": "Director" }
  ],
  "status": "NOW_SHOWING"
}
```

---

## 🎯 Admin Panel Updates Needed

Add these features to admin panel:

### Movie Management:
- [ ] Add genre multi-select dropdown
- [ ] Add language multi-select dropdown
- [ ] Add format multi-select dropdown
- [ ] Add certificate dropdown (U, UA, A, S)
- [ ] Add status dropdown (NOW_SHOWING, COMING_SOON, ENDED)
- [ ] Add banner image field
- [ ] Add trailer URL field
- [ ] Add cast/crew input fields
- [ ] Add description textarea

### Theatre Management:
- [ ] Add city dropdown
- [ ] Add facilities multi-select
- [ ] Add food & beverage toggle
- [ ] Add cancellation available toggle

### Show Management:
- [ ] Add format dropdown
- [ ] Add language dropdown
- [ ] Add prime time toggle
- [ ] Show convenience fee field
- [ ] Show GST field

### New Admin Sections:
- [ ] Offer Management (Create, Edit, Delete offers)
- [ ] Food Management (Create, Edit, Delete food items)
- [ ] Review Moderation (View, Hide, Delete reviews)

---

## 📱 Frontend Integration Guide

### 1. Homepage Enhancements
```javascript
// Fetch movies by status
const nowShowing = await axios.get('/api/movies/status/NOW_SHOWING');
const comingSoon = await axios.get('/api/movies/status/COMING_SOON');

// Display movie with new fields
<MovieCard 
  title={movie.title}
  poster={movie.poster}
  rating={movie.rating}
  votes={movie.votes}
  genre={movie.genre}
  language={movie.language}
  format={movie.format}
  certificate={movie.certificate}
/>
```

### 2. Movie Details Page
```javascript
// Show cast, crew, trailer, reviews
const reviews = await axios.get(`/api/reviews/movie/${movieId}`);
```

### 3. Booking Flow
```javascript
// Step 1: Select show with format & language
// Step 2: Select seats
// Step 3: Add food items
const foodItems = await axios.get('/api/food');

// Step 4: Apply offer code
const validation = await axios.post('/api/offers/validate', {
  code: offerCode,
  bookingAmount: totalAmount,
  applicableOn: 'MOVIES'
});

// Step 5: Payment breakdown
// - Ticket Price: ₹X
// - Convenience Fee: ₹Y
// - Food & Beverage: ₹Z
// - GST: ₹A
// - Discount: -₹B
// - Total: ₹C
```

### 4. User Profile
```javascript
// Update preferences
await axios.put('/api/users/preferences', {
  city: 'Bangalore',
  preferredLanguages: ['English', 'Hindi'],
  preferredGenres: ['Action', 'Thriller']
});
```

---

## 🔄 Database Backup

Before running migrations, backup your database:
```bash
mongodump --uri="YOUR_MONGO_URI" --out=./backup
```

---

## 🐛 Troubleshooting

### Migration Issues:
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify tenant exists in database

### API Issues:
- Check authentication token
- Verify user has correct tenantId
- Check server logs for errors

---

## 📊 Next Steps

### Phase 2: Frontend UI (Upcoming)
- Modern homepage with carousel
- Movie filters sidebar
- City selection
- Enhanced movie cards
- Food ordering interface
- Offer code input
- Review submission
- User dashboard

### Phase 3: Advanced Features (Future)
- Payment gateway integration
- Email/SMS notifications
- Social media sharing
- Mobile app
- Admin analytics dashboard

---

## 📞 Support

For issues or questions:
1. Check BOOKMYSHOW_FEATURES.md for detailed documentation
2. Review migration logs
3. Test endpoints with Postman/Thunder Client
4. Check backend/server.js for registered routes

---

## ✨ Summary

You now have a production-ready backend with:
- ✅ Enhanced movie catalog with genres, formats, cast
- ✅ Multi-language & multi-format support
- ✅ Dynamic pricing with breakdown
- ✅ Food & beverage ordering
- ✅ Discount coupons & offers
- ✅ User reviews & ratings
- ✅ City-based filtering
- ✅ Theatre facilities info
- ✅ Booking cancellation support

**Backend is ready for BookMyShow-style frontend!** 🎉
