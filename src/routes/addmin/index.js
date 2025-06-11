"use strict";

const express = require('express');

const route = express.Router();
const workerMngController = require('../../controllers/workerMngController');
const {isAdmin} = require("../../middleware/auth");
// eg baseurl/addmin/addEmployee
route.post("/addEmployee", isAdmin, workerMngController.addEmployee);
route.get("/getAllEmployees", isAdmin, workerMngController.getAllEmployees);
route.put("/updateEmployee/:id", isAdmin, workerMngController.updateEmployee);
route.delete("/deleteEmployee/:id", isAdmin, workerMngController.deleteEmployee);
route.get("/getAllSchedules", isAdmin, workerMngController.getAllSchedules);
route.post("/updateSchedule/:id", isAdmin, workerMngController.updateSchedule);
route.post("/addSchedule", isAdmin, workerMngController.addSchedule);
route.delete("/deleteSchedule/:id", isAdmin, workerMngController.deleteSchedule);


module.exports = route;