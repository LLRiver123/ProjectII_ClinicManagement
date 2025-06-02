"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserService = require("../service/userService");
const LogService = require("../service/logService");
const {asyncHandler} = require("../middleware/asyncHandler");

const JWT_SECRET = process.env.JWT_SECRET

class AuthController{
    sendOTP = asyncHandler(async (req, res) => {
      console.log("req.body:", req.body);
        
      const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
    
        const result = await UserService.createOTP(email);
        return res.status(result.code).json(result);
      });
    
      // Xác minh OTP và tạo user
      verifyOTP = asyncHandler(async (req, res) => {
        const { email, otp, name, password } = req.body;
        if (!email || !otp || !name || !password) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        const result = await UserService.verifyOTP( email, otp, name, password );
        return res.status(result.code).json(result);
      });

      login = asyncHandler(async (req, res) => {
        const { name, password } = req.body;
        if (!name || !password) {
          await LogService.createLog("Login failed", "Missing required fields", "error");
          return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await UserService.checkLogin(name, password);
        if (result.code !== 200) {
          await LogService.createLog("Login failed", result.message, "error");
          return res.status(result.code).json(result);
        }
        return res.status(result.code).json(result);
        
        
      });
}

module.exports = new AuthController();