const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const protect = require("../utils/authMiddleware");
const output = require("../utils/output");
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
  if (
    req.body.fname &&
    req.body.lname &&
    req.body.username &&
    req.body.email &&
    req.body.password
  ) {
    let newUser = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    User.findOne({ email: newUser.email }, function (err, user) {
      if (user) {
        return res.status(400).json(output("Email Exists"));
      }
    });
    newUser = await newUser.save();
    if (newUser) {
      return res.json(
        output("User Created succesfully and Signed In", {
          user_id: newUser.fname,
          userRole: newUser.userRole,
          token: generateToken(newUser._id),
        })
      );
    } else {
      return res.json(output("Error occcured while creating User"));
    }
  } else {
    output("Required Fields are Missing");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("here", req.body);
    let user = await User.findOne({ email: email });
    const match = await bcrypt.compareSync(password, user.password);
    if (!user || !match) {
      res.json(output("Invalid Email or Password"));
    } else {
      res.status(200).json(
        output("Log In Success", {
          fname: user.fname,
          userRole: user.userRole,
          token: generateToken(user._id),
        })
      );
    }
  } catch {
    res.status(500).json(output("Log In Failed"));
  }
});

router.get("/profile", protect, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({ _id: id });
  if (user) {
    res.status(200).json(
      output("Profile", {
        fname: user.fname,
        lname: user.lname,
        username: user.username,
        email: user.email,
        password: user.password,
        img: user.img,
      })
    );
  } else {
    res.json(output("Coud Not Get Profile"));
  }
});

//update profile
router.put("/profile/update", protect, async (req, res) => {
  delete req.body._id;
  await User.updateOne({ _id: req.id }, { $set: req.body });
  let user = await User.findOne({ _id: req.id });
  if (user) {
    res.status(200).json(
      output("Updated Profile", {
        fname: user.fname,
        lname: user.lname,
        username: user.username,
        email: user.email,
        password: user.password,
        img: user.img,
      })
    );
  } else {
    res.json(output("Coud Not Update Profile"));
  }
});

module.exports = router;
