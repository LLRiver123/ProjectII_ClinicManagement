"use strict";

const express = require('express');
const {isAdmin, checkAuth, isDoctor} = require("../../middleware/auth");
const route = express.Router();
const checkupController = require('../../controllers/checkupController');

route.get("/getCheckUp", checkAuth, checkupController.getCheckUp);
route.post("/addCheckup", isDoctor, checkupController.addCheckUp);

module.exports = route;