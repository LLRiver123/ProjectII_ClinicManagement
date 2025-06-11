"use strict";

const express = require('express');

const route = express.Router();
const authController = require('../../controllers/authController');

route.post("/otp", authController.sendOTP);
route.post("/verifyOTP", authController.verifyOTP);
route.post("/login", authController.login);
route.post("/register", authController.register);
route.post("/logout", authController.logout);

module.exports = route;

