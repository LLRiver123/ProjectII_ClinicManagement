"use strict";

const express = require('express');
const {isAdmin, checkAuth} = require("../../middleware/auth");
const route = express.Router();
const userController = require('../../controllers/userController');

route.get("/allUsers",isAdmin,userController.getUsers);
//route.post("/updateInfo", userController.updateInfo);

route.post("/makeAppointment", checkAuth, userController.makeAppointment);
route.post("/cancelAppointment", checkAuth, userController.cancelAppointment);

module.exports = route;
