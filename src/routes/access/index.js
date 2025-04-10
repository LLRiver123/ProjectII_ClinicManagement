"use strict";

const express = require('express');

const route = express.Router();
const authController = require('../../controllers/authController');

route.get("/otp", authController.sendOTP);
route.post("/verifyOTP", authController.verifyOTP);

module.exports = route;

