const express = require("express");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Category = require("../models/categoryModel");
const Review = require("../models/reviewModel");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const output = require("../utils/output");

//favourites
router.get("/favourites", protect, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({ _id: id }).populate({
    path: "favourites",
    populate: [
      {
        path: "author",
      },
      {
        path: "category",
      },
    ],
  });
  let myBooks = [];
  user.favourites.map((book) => {
    myBook = {
      bookID: book._id,
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
  if (user) {
    res.status(200).json(
      output("User Favourites", {
        favourites: myBooks,
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
  console.log("user", user);
  console.log("bookId", req.body.id);
  if (user && req.body.id) {
    console.log("user fav b4 add", user.favourites);
    if (user.favourites && user.favourites.length > 0) {
      if (
        user.favourites.filter((i) => i.toString() === req.body.id).length > 0
      ) {
        return res.status(400).json({ msg: "book already favourited" });
      }
    }
    user.favourites.push(req.body.id);
    await user.save();
    console.log("user fav after add", user.favourites);
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
  if (user.favourites && user.favourites.length > 0 && req.body.id) {
    // if (
    //   user.favourites.filter((i) => i.toString() === req.body._id).length === 0
    // ) {
    //   return res.status(400).json({ msg: "book has not been favourited" });
    // }
    const removeIndex = user.favourites
      .map((i) => i.toString())
      .indexOf(req.body.id);
    user.favourites.splice(removeIndex, 1);
    await user.save();
    console.log("user fav after remove", user.favourites);
    res.status(200).json(
      output("User Favourites", {
        favourites: user.favourites,
      })
    );
  } else {
    res.json(output("Coud Not Get favourites"));
  }
});

//add reviews
router.put("/review/add", protect, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({ _id: id });
  
  if (req.body.id && req.body.review) {
    let book = await Book.findOne({ _id: req.body.id });
    let rev ={
      reviewer: user.username,
      review: req.body.review,
    }
    book.reviews.push(rev);
    await book.save();
    res.status(200).json(
      output("Book Reviews", {
        title: book.title,
        reviews: book.reviews
      })
    );
  
  } else {
    res.json(output("id or review not found"));
  }
});

//add rating
router.put("/rating/add", protect, async (req, res) => {
  console.log("id", req.body.id)
  console.log("rating", req.body.rating)
  if (req.body.id && req.body.rating) {
    let book = await Book.findOne({ _id: req.body.id });
    book.ratings.push(req.body.rating);
    book.rating = book.ratings.reduce((a, b) => a + b, 0)/ book.ratings.length
    await book.save();
    res.status(200).json(
      output("Book Reviews", {
        title: book.title,
        avgRating: book.rating
      })
    );
  } else {
    res.json(output("id or rating not found"));
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
        bookID: book._id,
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
        bookID: book._id,
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
      .sort({ rating: 1 })
      .limit(15)
      .populate(["author", "category"]);
    let myBooks = [];
    books.map((book) => {
      myBook = {
        bookID: book._id,
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
    console.log("get book by id", book);
    let myBook = {
      bookID: book._id,
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
        bookID: book._id,
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
