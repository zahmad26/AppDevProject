const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewDate: { type: Date, default: Date.now }
  }
);

const Review = mongoose.model("Review", reviewSchema, "Reviews");
module.exports = Review;
