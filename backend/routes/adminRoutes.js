const express = require("express");
const Author = require("../models/authorModel");
const Category = require("../models/categoryModel");
const Book = require("../models/bookModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const protect = require("../utils/authMiddleware");
const output = require("../utils/output");

//add book
router.post("/book", async (req, res) => {
  try {
    if (req.body) {
      let newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        category: req.body.category,
        reviews: req.body.reviews,
        img: req.body.img,
      });

      let book = await Book.find({ title: newBook.title });
      if (book && book.length != 0) {
        return res.status(400).json(output("Book Exists"));
      } else {
        newBook = await newBook.save();
        if (newBook) {
          return res.json(
            output("Book Created succesfully", {
              book: newBook,
            })
          );
        } else {
          return res.json(output("Error occcured while creating Book"));
        }
      }
    } else {
      output("Required Fields are Missing");
    }
  } catch {
    res.status(500).json(output("Book could not be created"));
  }
});

//add author
router.post("/author", async (req, res) => {
  try {
    if (req.body) {
      let newAuthor = new Author({
        aname: req.body.aname,
        aimg: req.body.aimg,
        description: req.body.description,
        rating: req.body.rating,
      });
      let author = await Author.findOne({ cname: newAuthor.aname });
      console.log(author);
      if (author && author.length != 0) {
        return res.status(400).json(output("Author Exists"));
      } else {
        newAuthor = await newAuthor.save();
        if (newAuthor) {
          return res.json(
            output("Author Created succesfully", {
              author: newAuthor,
            })
          );
        } else {
          return res.json(output("Error occcured while creating Author"));
        }
      }
    } else {
      output("Required Fields are Missing");
    }
  } catch {
    res.status(500).json(output("Author could not be created"));
  }
});

//add category
router.post("/category", async (req, res) => {
  try {
    if (req.body) {
      let newCategory = new Category({
        cname: req.body.cname,
        cimg: req.body.cimg,
      });
      let category = await Category.findOne({ cname: newCategory.cname });
      if (category && category.length != 0) {
        return res.status(400).json(output("Category Exists"));
      } else {
        newCategory = await newCategory.save();
        if (newCategory) {
          return res.json(
            output("Category Created succesfully", {
              cname: newCategory.cname,
            })
          );
        } else {
          return res.json(output("Error occcured while creating Category"));
        }
      }
    } else {
      output("Required Fields are Missing");
    }
  } catch {
    res.status(500).json(output("Category could not be created"));
  }
});

module.exports = router;
