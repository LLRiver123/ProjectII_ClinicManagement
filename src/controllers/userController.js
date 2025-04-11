"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserService = require("../service/userService");
const {asyncHandler} = require("../middleware/asyncHandler");
// const {checkAuth, isAdmin} = require("../middleware/auth");

class UserController{
    getUsers = asyncHandler(async (req, res) => {
        const users = await UserService.getUsers();
        return res.status(200).json(users);
        });
}

module.exports = new UserController();