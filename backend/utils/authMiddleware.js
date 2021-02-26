const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const user = new User();
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //   console.log(req.user);
      req.id = decoded.id;
      console.log(req.id);

      next();
    } catch (error) {
      //   console.error(error);
      res.status(401).json({
        message: "Not Authorized, token failed",
      });
    }
  }
  if (!token) {
    res.status(401).json({
      message: "Not Authorized, no token",
    });
  }
};

module.exports = protect;
