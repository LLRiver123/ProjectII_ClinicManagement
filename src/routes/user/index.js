"use strict";

const express = require('express');
const {isAdmin, checkAuth} = require("../../middleware/auth");
const route = express.Router();
const userController = require('../../controllers/userController');

route.get("/allUsers",isAdmin,userController.getUsers);
//route.post("/updateInfo", userController.updateInfo);

route.post("/makeAppointment", checkAuth, userController.makeAppointment);
route.post("/cancelAppointment", checkAuth, userController.cancelAppointment);
route.post("/updateRole", isAdmin, userController.updateRole);
route.get("/getAppointments", checkAuth, userController.getAppointments);
route.post("/deleteUser", isAdmin, userController.deleteUser);
route.get("/getAllAppointments", isAdmin, userController.getAllAppointments);


module.exports = route;
