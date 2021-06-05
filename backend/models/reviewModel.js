const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    review: { type: String, required: true },
  }
);

const Review = mongoose.model("Review", reviewSchema, "Reviews");
module.exports = Review;
