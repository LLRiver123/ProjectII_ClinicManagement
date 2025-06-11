"use strict";

const express = require('express');
const {isAdmin, checkAuth} = require("../../middleware/auth");
const route = express.Router();
const invoiceController = require('../../controllers/invoiceController');

route.post("/createInvoice", checkAuth, invoiceController.createInvoice);
route.put("/payInvoice/:invoice_id", checkAuth, invoiceController.payInvoice);
route.get("/getCompletedAppointments", checkAuth, invoiceController.getCompletedAppointments);
route.post("/updateAppointment", checkAuth, invoiceController.updateAppointment);
route.get("/getPrescriptionByRecordId/:recordId", checkAuth, invoiceController.getPrescriptionByRecordId);
route.get("/getMedicalRecordByAppointmentId/:appointmentId", checkAuth, invoiceController.getMedicalRecordByAppointmentId);
route.get("/getAllInvoices", checkAuth, invoiceController.getAllInvoices);
route.post("/editInvoice", checkAuth, invoiceController.editInvoice);

module.exports = route;