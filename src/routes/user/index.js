"use strict";

const express = require('express');
const {isAdmin, checkAuth} = require("../../middleware/auth");
const route = express.Router();
const userController = require('../../controllers/userController');

route.get("/allUsers",checkAuth,userController.getUsers);
//route.post("/updateInfo", userController.updateInfo);
route.get("/getDoctors", checkAuth, userController.getDoctors);
route.post("/makeAppointment", checkAuth, userController.makeAppointment);
route.post("/cancelAppointment", checkAuth, userController.cancelAppointment);

route.post("/getAppointments", checkAuth, userController.getAppointments);
route.post("/deleteUser", isAdmin, userController.deleteUser);
route.get("/getAllAppointments", checkAuth, userController.getAllAppointments);
route.post("/updateUser", isAdmin, userController.updateUser);



module.exports = route;
