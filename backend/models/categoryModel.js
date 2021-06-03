const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        cname: { type: String, required: true }
    }
);

const Category = mongoose.model("Category", categorySchema, "Category");
module.exports = Category;
