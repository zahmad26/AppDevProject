const express = require("express");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const output = require("../utils/output");

//favourites
router.get("/favourites", protect, async (req, res) => {
    const id = req.id;
    let user = await User.findOne({ _id: id })
    if (user) {
        res.status(200).json(
            output("User Favourites",{
                favourites: user.favourites
            })
        );
    } else {
        res.json(
            output("Coud Not Get favourites")
        );
    }
});

//add to favourites
router.put("/favourites", protect, async (req, res) => {
    const id = req.id;
    const newFav = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        category: req.body.category,
        reviews: req.body.reviews,
        avgRating: req.body.avgRating,
        reviewCount: req.body.reviewCount,
        dateAdded: req.body.dateAdded,
        img: req.body.img,
        bookPdf: req.body.bookPdf
    });
    let user = await User.findOne({ _id: id })
    if (user) {
        user.favourites.push(newFav);
        res.status(200).json(
            output("User Favourites",{
                favourites: user.favourites
            })
        );
    } else {
        res.json(
            output("Coud Not Get favourites")
        );
    }
});


module.exports = router;