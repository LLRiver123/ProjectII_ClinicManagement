"use strict";

const express = require('express');
const {isAdmin, checkAuth, isDoctor} = require("../../middleware/auth");
const route = express.Router();
const checkupController = require('../../controllers/checkupController');

route.get("/getCheckUp", checkAuth, checkupController.getCheckUp);
route.post("/addCheckup", isDoctor, checkupController.addCheckUp);
route.post("/addPrescription", isDoctor, checkupController.addPrescription);
//route.get("/getPrescriptions", checkAuth, checkupController.getPrescriptions);

module.exports = route;