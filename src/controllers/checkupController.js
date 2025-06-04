"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CheckupService = require("../service/checkupService");
const LogService = require("../service/logService");
const {asyncHandler} = require("../middleware/asyncHandler");

class CheckupController {
  getCheckUp = asyncHandler(async (req, res) => {
    const result = await CheckupService.getAllCheckUps();
    await LogService.createLog("Get all checkups", "Fetched all checkups successfully", "success");
    return res.status(result.code).json(result);
  });

  addCheckUp = asyncHandler(async (req, res) => {
    const { appointmentId, diagnosis, prescription, note } = req.body;
    if (!appointmentId || !diagnosis || !prescription || !note) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await CheckupService.addCheckUp(appointmentId, diagnosis, prescription, note);
    if (result.code !== 200) {
      await LogService.createLog("Add checkup failed", result.message, "error");
      return res.status(result.code).json(result);
    }
    return res.status(result.code).json(result);
  });

}

module.exports = new CheckupController();