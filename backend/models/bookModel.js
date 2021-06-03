const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
        description: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
        avgRating: { type: Number },
        reviewCount: { type: Number },
        dateAdded: { type: Date },
        img: { type: String },
        bookPdf: { type: String },
        isFavourite: {type:Boolean, default:false}

    }
);

const Book = mongoose.model("Book", bookSchema, 'Books');
module.exports = Book;
