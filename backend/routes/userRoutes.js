const express = require("express");
const router = express.Router();
const user = require('../models/userModel');
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


router.get("/login", async (req, res) => {
    res.send("hello");
});

module.exports = router;