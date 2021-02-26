const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken')
const protect = require("../utils/authMiddleware");
//const userRole = require("../models/userRoleModel");


/*user.create([
    {
        fname: "Zuha",
        lname: "Ahmad",
        username: 'zee',
        email: 'zuha.ahmad@gmail.com',
        password: 'zuha@123',
    }
]);*/

router.post("/register", async (req, res) => {
    let newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });
    User.findOne({ email: newUser.email }, function (err, user) {
        if (user) {
            return res.status(400).json({ auth: false, message: "email exists" });
        } else{
            console.log("email is unique");
        }
    });

    newUser = await newUser.save();
    if (newUser) {
        return res.json({
            message: "User Created succesfully and Signed In",
            user_id: newUser.fname,
            userRole: newUser.userRole,
            token: generateToken(newUser._id)
        });
    } else {
        return res.json({ message: "Error occcured while creating User" });
    }


});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email })

    if (!user) {
        res.json({ message: "Email not registered" });
    }
    else {
        const match = await bcrypt.compareSync(password, user.password);
        if (user && match) {
            return res.status(200).json({
                message: "Log In Success",
                user_id: user.fname,
                userRole: user.userRole,
                token: generateToken(user._id)
            });
        } else {
            res.json({ message: "Invalid Password" });
        }
    }

});

router.get("/profile", protect, async (req, res) => {
    const id = req.id;
    let user = await User.findOne({ _id: id })
    if (user) {
        res.status(200).json({
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            email: user.email,
            password: user.password,
            img: user.img
        });
    } else{
        res.json({ message: "User not found" });
    }
});

module.exports = router;