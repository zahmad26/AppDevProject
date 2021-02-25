const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
    {
        aname: { type: String, required: true },
        description: { type: String, required: true },
        rating: { type: Number, required: true },
        aimg: { type: String }
    }
);

const Author = mongoose.model("Author", authorSchema, "Authors");
module.exports = Author;
