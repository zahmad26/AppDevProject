const express = require("express");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Category = require("../models/categoryModel");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const output = require("../utils/output");

//favourites
router.get("/favourites", protect, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({ _id: id }).populate("favourites");
  if (user) {
    res.status(200).json(
      output("User Favourites", {
        favourites: user.favourites,
      })
    );
  } else {
    res.json(output("Coud Not Get favourites"));
  }
});

//add to favourites
router.put("/favourites", protect, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({ _id: id });
  if (user) {
    user.favourites.push(req.body._id);
    res.status(200).json(
      output("User Favourites", {
        favourites: user.favourites,
      })
    );
  } else {
    res.json(output("Coud Not Get favourites"));
  }
});

//get all categories
router.get("/category", protect, async (req, res) => {
  try {
    console.log("here")
    const categories = await Category.find();
    if (categories) {
      res.status(200).json({
        categories: categories,
      });
    } else {
      res.json(output("Coud Not Get Categories"));
    }
  } catch {
    res.status(500).json(output("Get Categories Failed"));
  }
});

//get popular books
router.get("/popular", protect, async (req, res) => {
  try {
    const books = await Book.find().sort({ avgRating: -1 }).limit(15);
    if (books) {
      res.status(200).json({
        PopularBooks: books,
      });
    } else {
      res.json(output("Coud Not Get Popular Books"));
    }
  } catch {
    res.status(500).json(output("Get Popular Books Failed"));
  }
});

//get latest books
router.get("/latest", protect, async (req, res) => {
  try {
    const books = await Book.find().sort({ dateAdded: -1 }).limit(15);
    if (books) {
      res.status(200).json({
        LatestBooks: books,
      });
    } else {
      res.json(output("Coud Not Get Latest Books"));
    }
  } catch {
    res.status(500).json(output("Get Latest Books Failed"));
  }
});

//get trending books
router.get("/trending", protect, async (req, res) => {
  try {
    const books = await Book.find().sort({ dateAdded: -1 }).limit(15);
    if (books) {
      res.status(200).json({
        LatestBooks: books,
      });
    } else {
      res.json(output("Coud Not Get Latest Books"));
    }
  } catch {
    res.status(500).json(output("Get Latest Books Failed"));
  }
});

//get book by id
router.get("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "author",
      "category",
      {
        path: "reviews",
        populate: [
          {
            path: "reviewer",
          },
        ],
      }
    );
    if (book) {
      res.status(200).json({
        book: book,
      });
    } else {
      res.json(output("Coud Not Get Book Details"));
    }
  } catch {
    res.status(500).json(output("Get Book Details Failed"));
  }
});

//get all books
router.get("/", protect, async (req, res) => {
  try {
    const books = await Book.find().populate("author", "category", {
      path: "reviews",
      populate: [
        {
          path: "reviewer",
        },
      ],
    });
    if (books) {
      res.status(200).json({
        books: book,
      });
    } else {
      res.json(output("Coud Not Get Books"));
    }
  } catch {
    res.status(500).json(output("Get Books Failed"));
  }
});


module.exports = router;
