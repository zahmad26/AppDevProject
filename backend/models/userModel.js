const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
        img: { type: String },
        userRole: { type: String, ref: "UserRole", default: "reader"}
    }
);

const User = mongoose.model("User", userSchema, "Users");
module.exports = User;
