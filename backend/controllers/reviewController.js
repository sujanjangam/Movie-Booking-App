import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

// Create or update review
export const createReview = async (req, res) => {
  try {
    const { movieId, rating, title, review } = req.body;
    const userId = req.user._id;
    const tenantId = req.user.tenantId;

    // Check if user already reviewed this movie
    let existingReview = await Review.findOne({ user: userId, movie: movieId });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.title = title;
      existingReview.review = review;
      await existingReview.save();
      return res.json(existingReview);
    }

    const newReview = await Review.create({
      user: userId,
      movie: movieId,
      rating,
      title,
      review,
      tenantId
    });

    // Update movie rating
    await updateMovieRating(movieId);

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a movie
export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movie: movieId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update movie rating
const updateMovieRating = async (movieId) => {
  const reviews = await Review.find({ movie: movieId });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);
    
    await Movie.findByIdAndUpdate(movieId, {
      rating: avgRating,
      votes: reviews.length
    });
  }
};

// Like/dislike review
export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body; // 'like' or 'dislike'

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (action === "like") {
      review.likes += 1;
    } else if (action === "dislike") {
      review.dislikes += 1;
    }

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
