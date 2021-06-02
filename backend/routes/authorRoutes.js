const express = require("express");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const output = require("../utils/output");

//get top authors
router.get("/top", protect, async (req, res) => {
  try {
    const authors = await Author.find().sort({ rating: -1 }).limit(10);
    if (authors) {
      res.status(200).json({
        TopAuthors: authors,
      });
    } else {
      res.json(output("Coud Not Get Top Authors"));
    }
  } catch {
    res.status(500).json(output("Get Top Authors Failed"));
  }
});

//get author by id
router.get("/:id", protect, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json({
        author: author,
      });
    } else {
      res.json(output("Coud Not Get Author Details"));
    }
  } catch {
    res.status(500).json(output("Get Author Failed"));
  }
});

module.exports = router;
