# Movie Booking App - Complete Build Documentation

## ✅ Features Implemented

### 1. Show Creation System
- **Automatic Seat Generation**: Creates 80 seats (A1-A10, B1-B10, ..., H1-H10)
- **Show Details**: Movie + Theatre + Date + Time + Price
- **Seat Structure**: Each seat has number, row, and status (available/booked)

### 2. Seat Booking Logic
- **Real-time Availability Check**: Validates seats before booking
- **Concurrent Booking Prevention**: Checks if seats are already booked
- **Automatic Status Update**: Marks seats as booked after successful booking
- **Price Calculation**: Dynamic pricing based on show price

### 3. Admin Panel
- **Add Movies**: Title, Poster URL, Duration, Language
- **Add Theatres**: Name, Location
- **Create Shows**: Select Movie, Theatre, Date, Time, and set Price

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          - User authentication
│   ├── Movie.js         - Movie details
│   ├── Theatre.js       - Theatre information
│   ├── Show.js          - Show with seats (A1-H10)
│   └── Booking.js       - User bookings
├── controllers/
│   ├── authController.js      - Register/Login
│   ├── movieController.js     - Movie CRUD
│   ├── theatreController.js   - Theatre CRUD
│   ├── showController.js      - Show creation with seat generation
│   └── bookingController.js   - Booking logic with validation
└── routes/
    ├── authRoutes.js
    ├── movieRoutes.js
    ├── theatreRoutes.js
    ├── showRoutes.js
    └── bookingRoutes.js

frontend/
├── pages/
│   ├── Home.js                  - Movie listing
│   ├── MovieDetails.js          - Shows for a movie
│   ├── SeatSelection.js         - Seat grid (A1-H10)
│   ├── BookingPage.js           - User bookings
│   ├── Login.js / Register.js   - Authentication
│   ├── AdminDashboard.js        - Admin home
│   ├── AdminMovieCreate.js      - Add movies
│   ├── AdminTheatreCreate.js    - Add theatres
│   └── AdminShowCreate.js       - Create shows
└── components/
    ├── Navbar.js
    ├── MovieCard.js
    ├── SeatGrid.js
    └── Loader.js
```

## 🎯 Seat Structure

### Seat Generation (80 seats total)
```
Rows: A, B, C, D, E, F, G, H
Seats per row: 1-10

Example:
A1  A2  A3  A4  A5  A6  A7  A8  A9  A10
B1  B2  B3  B4  B5  B6  B7  B8  B9  B10
...
H1  H2  H3  H4  H5  H6  H7  H8  H9  H10
```

### Seat Schema
```javascript
{
  number: "A1",      // Seat identifier
  row: "A",          // Row letter
  status: "available" // available or booked
}
```

## 🔄 Booking Flow

1. **User selects movie** → Views available shows
2. **User selects show** → Views seat grid (A1-H10)
3. **User selects seats** → Seats turn blue (selected)
4. **User clicks "Book Now"**:
   - Backend checks if seats are available
   - If available: Marks seats as booked, creates booking
   - If unavailable: Returns error with unavailable seat numbers
5. **Booking confirmed** → User redirected to "My Bookings"

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Add movie

### Theatres
- `GET /api/theatres` - Get all theatres
- `POST /api/theatres` - Add theatre

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/movie/:movieId` - Get shows for a movie
- `GET /api/shows/:id` - Get show by ID (with seats)
- `POST /api/shows` - Create show (auto-generates 80 seats)

### Bookings (Protected)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user's bookings

## 📝 Usage Guide

### For Admins:

1. **Add Movies**:
   - Navigate to `/admin/movies`
   - Fill in: Title, Poster URL, Duration, Language
   - Click "Add Movie"

2. **Add Theatres**:
   - Navigate to `/admin/theatres`
   - Fill in: Name, Location
   - Click "Add Theatre"

3. **Create Shows**:
   - Navigate to `/admin/shows`
   - Select: Movie, Theatre, Date, Time
   - Set: Price (default ₹100)
   - Click "Create Show"
   - System automatically generates 80 seats (A1-H10)

### For Users:

1. **Register/Login**:
   - Create account or login
   - Token stored in localStorage

2. **Browse Movies**:
   - View all movies on home page
   - Click movie to see details

3. **Book Tickets**:
   - Select show (date, time, theatre)
   - Select seats from grid
   - See total price
   - Click "Book Now"
   - View booking in "My Bookings"

## 🎨 Seat Color Coding

- **Green**: Available seats
- **Blue**: Selected seats (by current user)
- **Red**: Booked seats (unavailable)

## 🚀 How to Run

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

### Environment Variables (.env):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 🔧 Key Features

### Seat Generation Logic:
```javascript
const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  const seats = [];

  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        number: `${row}${i}`,
        row: row,
        status: 'available'
      });
    }
  });

  return seats;
};
```

### Booking Validation:
```javascript
// Check if seats are already booked
const unavailable = show.seats.filter(
  (s) => seats.includes(s.number) && s.status === "booked"
);

if (unavailable.length > 0) {
  return res.status(400).json({ 
    message: "Some seats are already booked",
    unavailableSeats: unavailable.map(s => s.number)
  });
}

// Mark seats as booked
show.seats.forEach((s) => {
  if (seats.includes(s.number)) {
    s.status = "booked";
  }
});
```

## ✨ What's Working

✅ User registration and login
✅ Movie listing and details
✅ Theatre management
✅ Show creation with automatic seat generation (A1-H10)
✅ Seat selection with visual feedback
✅ Booking validation and creation
✅ User booking history
✅ Admin panel for content management
✅ Dynamic pricing
✅ Real-time seat availability

## 🎯 Next Steps (Optional Enhancements)

- Add user roles (admin/user)
- Add payment integration
- Add booking cancellation
- Add seat hold/lock mechanism (temporary reservation)
- Add email notifications
- Add movie ratings and reviews
- Add search and filter functionality
