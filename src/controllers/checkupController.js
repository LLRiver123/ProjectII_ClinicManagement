"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CheckupService = require("../service/checkupService");
const LogService = require("../service/logService");
const {asyncHandler} = require("../middleware/asyncHandler");

class CheckupController {
  getCheckUp = asyncHandler(async (req, res) => {
    const result = await CheckupService.getAllCheckUps();
    if (result.code !== 200) {
      await LogService.createLog(req.user?.id, "Get all checkups failed: ");
      return res.status(result.code).json(result);
    }
    await LogService.createLog(req.user?.id, "Get all checkups success");
    return res.status(result.code).json(result);
  });

  addCheckUp = asyncHandler(async (req, res) => {
    const { appointmentId, diagnosis, prescription, note } = req.body;
    if (!appointmentId || !diagnosis || !prescription || !note) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await CheckupService.addCheckUp(appointmentId, diagnosis, prescription, note);
    if (result.code !== 200) {
      await LogService.createLog(req.user?.id, "Add checkup failed: " );
      return res.status(result.code).json(result);
    }
    await LogService.createLog(req.user?.id, "Add checkup success");
    return res.status(result.code).json(result);
  });

}

module.exports = new CheckupController();