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
          await LogService.createLog(req.user?.id, "Login failed: Missing required fields");
          return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await UserService.checkLogin(name, password);
        if (result.code !== 200) {
          await LogService.createLog(req.user?.id, "Login failed: " + result.message);
          return res.status(result.code).json(result);
        }
        return res.status(result.code).json(result);
        
        
      });
      register = asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        const result = await UserService.register(name, email, password);
        if (result.code !== 200) {
          await LogService.createLog(req.user?.id, "Registration failed: " + result.message);
          return res.status(result.code).json(result);
        }
        return res.status(result.code).json(result);
      });

      logout = asyncHandler(async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    
        try {
          jwt.verify(token, JWT_SECRET);
          // Invalidate the token (this could be done by adding it to a blacklist)
          // For simplicity, we just return a success message
          return res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
          return res.status(401).json({ message: "Invalid token" });
        }
      });
}

module.exports = new AuthController();