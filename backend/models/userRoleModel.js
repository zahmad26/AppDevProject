const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema(
    {
        role: { type: String, required: true }
    }
);

const UserRole = mongoose.model("UserRole", userRoleSchema, "UserRoles");
module.exports = UserRole;
