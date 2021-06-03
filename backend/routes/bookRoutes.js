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
router.put("/favourites/add", protect, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({ _id: id });
  if (user) {
    console.log("here", user.favourites);
    if (user.favourites.length > 1) {
      if (
        user.favourites.filter((i) => i.toString() === req.body._id).length > 0
      ) {
        return res.status(400).json({ msg: "book already favourited" });
      }
    }
    user.favourites.push(req.body._id);
    await user.save();
    let book = await Book.findOne({ _id: req.body._id });
    book.isFavourite = true;
    await book.save();
    res.status(200).json(
      output("User Favourites", {
        favourites: user.favourites,
      })
    );
  } else {
    res.json(output("Coud Not Get favourites"));
  }
});

//remove from favourites
router.put("/favourites/remove", protect, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({ _id: id });
  if (user) {
    if (
      user.favourites.filter((i) => i.toString() === req.body._id).length === 0
    ) {
      return res.status(400).json({ msg: "book has not been favourited" });
    }
    const removeIndex = user.favourites
      .map((i) => i.toString())
      .indexOf(req.body._id);
    user.favourites.splice(removeIndex, 1);
    await user.save();
    let book = await Book.findOne({ _id: req.body._id });
    book.isFavourite = false;
    await book.save();
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
    console.log("here");
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
    const books = await Book.find()
      .sort({ rating: -1 })
      .limit(15)
      .populate(["author", "category"]);

    let myBooks = [];
    books.map((book) => {
      myBook = {
        title: book.title,
        author: book.author.aname,
        authorID: book.author._id,
        category: book.category.cname,
        rating: book.rating,
        reviews: book.reviews,
        isFavourite: book.isFavourite,
        url: book.url,
        description: book.description,
      };
      myBooks.push(myBook);
    });
    if (books) {
      res.status(200).json({
        popular: myBooks,
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
    const books = await Book.find()
      .sort({ dateAdded: -1 })
      .limit(15)
      .populate(["author", "category"]);

    let myBooks = [];
    books.map((book) => {
      myBook = {
        title: book.title,
        author: book.author.aname,
        authorID: book.author._id,
        category: book.category.cname,
        rating: book.rating,
        reviews: book.reviews,
        isFavourite: book.isFavourite,
        url: book.url,
        description: book.description,
      };
      myBooks.push(myBook);
    });
    if (books) {
      res.status(200).json({
        latest: myBooks,
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
    const books = await Book.find()
      .sort({ dateAdded: -1 })
      .limit(15)
      .populate(["author", "category"]);
    let myBooks = [];
    books.map((book) => {
      myBook = {
        title: book.title,
        author: book.author.aname,
        authorID: book.author._id,
        category: book.category.cname,
        rating: book.rating,
        reviews: book.reviews,
        isFavourite: book.isFavourite,
        url: book.url,
        description: book.description,
      };
      myBooks.push(myBook);
    });
    if (books) {
      res.status(200).json({
        trending: myBooks,
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
      ["author", "category"]
      // {
      //   path: "reviews",
      //   populate: [
      //     {
      //       path: "reviewer",
      //     },
      //   ],
      // }
    );
    console.log(book);
    let myBook = {
      title: book.title,
      author: book.author.aname,
      authorID: book.author._id,
      category: book.category.cname,
      rating: book.rating,
      reviews: book.reviews,
      isFavourite: book.isFavourite,
      url: book.url,
      description: book.description,
    };
    if (book) {
      res.status(200).json({
        book: myBook,
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
    const books = await Book.find().populate(
      ["author", "category"]
      // {
      //   path: "reviews",
      //   populate: [
      //     {
      //       path: "reviewer",
      //     },
      //   ],
      // }
    );
    console.log("books", books);
    let myBooks = [];
    books.map((book) => {
      myBook = {
        title: book.title,
        author: book.author.aname,
        authorID: book.author._id,
        category: book.category.cname,
        rating: book.rating,
        reviews: book.reviews,
        isFavourite: book.isFavourite,
        url: book.url,
        description: book.description,
      };
      myBooks.push(myBook);
    });
    if (books) {
      res.status(200).json({
        books: myBooks,
      });
    } else {
      res.json(output("Coud Not Get Books"));
    }
  } catch {
    res.status(500).json(output("Get Books Failed"));
  }
});

module.exports = router;
