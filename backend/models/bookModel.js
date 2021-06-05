const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    url: { type: String },
    reviews: [
      {
        reviewer: { type: String },
        review: { type: String },
      },
    ],
    rating: { type: Number },
    ratings: [{ type: Number }],
    dateAdded: { type: Date },
    isFavourite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema, "Books");
module.exports = Book;
