import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";
import Offer from "./models/Offer.js";
import FoodItem from "./models/FoodItem.js";

dotenv.config();

const sampleMoviesData = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    banner: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    duration: "2h 28m",
    language: ["English", "Hindi", "Tamil"],
    genre: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.8,
    votes: 25000,
    certificate: "UA",
    releaseDate: new Date("2010-07-16"),
    format: ["2D", "IMAX"],
    cast: [
      { name: "Leonardo DiCaprio", role: "Cobb", image: "" },
      { name: "Tom Hardy", role: "Eames", image: "" }
    ],
    crew: [
      { name: "Christopher Nolan", role: "Director", image: "" },
      { name: "Emma Thomas", role: "Producer", image: "" }
    ],
    status: "NOW_SHOWING"
  },
  {
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    banner: "https://image.tmdb.org/t/p/original/198vrF8k7mfQ4FjDJsBmdQcaiyq.jpg",
    trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    duration: "3h 12m",
    language: ["English", "Hindi", "Tamil", "Telugu"],
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 9.2,
    votes: 45000,
    certificate: "UA",
    releaseDate: new Date("2022-12-16"),
    format: ["2D", "3D", "IMAX", "IMAX 3D"],
    cast: [
      { name: "Sam Worthington", role: "Jake Sully", image: "" },
      { name: "Zoe Saldana", role: "Neytiri", image: "" }
    ],
    crew: [
      { name: "James Cameron", role: "Director", image: "" }
    ],
    status: "NOW_SHOWING"
  },
  {
    title: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    banner: "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    duration: "2h 56m",
    language: ["English", "Hindi"],
    genre: ["Action", "Crime", "Drama"],
    rating: 8.5,
    votes: 30000,
    certificate: "A",
    releaseDate: new Date("2022-03-04"),
    format: ["2D", "IMAX"],
    cast: [
      { name: "Robert Pattinson", role: "Batman", image: "" },
      { name: "Zoë Kravitz", role: "Catwoman", image: "" }
    ],
    crew: [
      { name: "Matt Reeves", role: "Director", image: "" }
    ],
    status: "NOW_SHOWING"
  },
  {
    title: "Spider-Man: Beyond the Spider-Verse",
    description: "Miles Morales returns for the next chapter of the Spider-Verse saga.",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    banner: "https://image.tmdb.org/t/p/original/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg",
    trailer: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    duration: "2h 30m",
    language: ["English", "Hindi", "Tamil", "Telugu"],
    genre: ["Animation", "Action", "Adventure"],
    rating: 9.5,
    votes: 12000,
    certificate: "U",
    releaseDate: new Date("2024-03-29"),
    format: ["2D", "3D", "IMAX 3D"],
    cast: [
      { name: "Shameik Moore", role: "Miles Morales", image: "" }
    ],
    crew: [
      { name: "Joaquim Dos Santos", role: "Director", image: "" }
    ],
    status: "COMING_SOON"
  }
];

const sampleOffersData = [
  {
    code: "FIRST100",
    title: "First Booking Offer",
    description: "Get ₹100 off on your first booking",
    discountType: "FLAT",
    discountValue: 100,
    maxDiscount: 100,
    minBookingAmount: 200,
    validFrom: new Date(),
    validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    usageLimit: 1000,
    applicableOn: ["MOVIES"],
    status: "ACTIVE"
  },
  {
    code: "WEEKEND50",
    title: "Weekend Special",
    description: "Get 50% off on weekend bookings (max ₹200)",
    discountType: "PERCENTAGE",
    discountValue: 50,
    maxDiscount: 200,
    minBookingAmount: 300,
    validFrom: new Date(),
    validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    usageLimit: 5000,
    applicableOn: ["ALL"],
    status: "ACTIVE"
  },
  {
    code: "FOOD20",
    title: "Food Combo Offer",
    description: "Get 20% off on food & beverages",
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscount: 100,
    minBookingAmount: 100,
    validFrom: new Date(),
    validTill: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    usageLimit: 2000,
    applicableOn: ["FOOD"],
    status: "ACTIVE"
  }
];

const sampleFoodItemsData = [
  {
    name: "Classic Salted Popcorn",
    description: "Freshly popped corn with the perfect amount of salt",
    category: "POPCORN",
    price: 150,
    size: "MEDIUM",
    isVeg: true,
    available: true
  },
  {
    name: "Caramel Popcorn",
    description: "Sweet and crunchy caramel-coated popcorn",
    category: "POPCORN",
    price: 200,
    size: "LARGE",
    isVeg: true,
    available: true
  },
  {
    name: "Coca-Cola",
    description: "Chilled Coca-Cola",
    category: "BEVERAGE",
    price: 100,
    size: "MEDIUM",
    isVeg: true,
    available: true
  },
  {
    name: "Pepsi",
    description: "Chilled Pepsi",
    category: "BEVERAGE",
    price: 100,
    size: "MEDIUM",
    isVeg: true,
    available: true
  },
  {
    name: "Popcorn + Coke Combo",
    description: "Medium popcorn with medium coke",
    category: "COMBO",
    price: 220,
    size: "NA",
    isVeg: true,
    available: true
  },
  {
    name: "Nachos with Cheese Dip",
    description: "Crispy nachos with creamy cheese dip",
    category: "SNACKS",
    price: 180,
    size: "NA",
    isVeg: true,
    available: true
  },
  {
    name: "Hot Dog",
    description: "Classic hot dog with sauces",
    category: "SNACKS",
    price: 150,
    size: "NA",
    isVeg: false,
    available: true
  },
  {
    name: "Cheese Burger",
    description: "Delicious cheese burger",
    category: "MEALS",
    price: 250,
    size: "NA",
    isVeg: false,
    available: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Get first tenant for sample data
    const tenants = await mongoose.connection.db.collection("tenants").find().toArray();
    if (tenants.length === 0) {
      console.log("⚠️  No tenants found. Please create a tenant first.");
      process.exit(1);
    }
    const tenantId = tenants[0]._id;

    console.log("\n🎬 Seeding Movies...");
    await Movie.deleteMany({ tenantId }); // Clear existing sample data
    const movies = await Movie.insertMany(
      sampleMoviesData.map(m => ({ ...m, tenantId }))
    );
    console.log(`✅ Added ${movies.length} movies`);

    console.log("\n🎟️  Seeding Offers...");
    await Offer.deleteMany({ tenantId });
    const offers = await Offer.insertMany(
      sampleOffersData.map(o => ({ ...o, tenantId }))
    );
    console.log(`✅ Added ${offers.length} offers`);

    console.log("\n🍿 Seeding Food Items...");
    await FoodItem.deleteMany({ tenantId });
    const foodItems = await FoodItem.insertMany(
      sampleFoodItemsData.map(f => ({ ...f, tenantId }))
    );
    console.log(`✅ Added ${foodItems.length} food items`);

    console.log("\n✨ Sample data seeded successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
