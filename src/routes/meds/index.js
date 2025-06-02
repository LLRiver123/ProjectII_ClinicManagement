"use strict";

const express = require('express');
const {isAdmin, checkAuth} = require("../../middleware/auth");
const route = express.Router();
const userController = require('../../controllers/userController');

route.post("/addMedicine", isAdmin, userController.addMedicine);
route.post("/updateMedicine", isAdmin, userController.updateMedicine);
route.post("/deleteMedicine", isAdmin, userController.deleteMedicine);
route.get("/getMedicines", checkAuth, userController.getMedicines);

module.exports = route;