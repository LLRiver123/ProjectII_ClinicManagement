"use strict";

const db = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {sendEmail} = require("../utils/sendMail")

class UserService{
  static generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
  static checkUser(name){
    user = db.query("SELECT * FROM users WHERE full_name = ? ORDER BY user_id DESC LIMIT 1", [name])
    if(!user) return {code: 404, message: "User not found"}
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [id]);
    return rows[0];
  }  
  static async createOTP(email) {
      const otp = UserService.generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins
  
      await db.query(
          "INSERT INTO otps (user_email, otp_code, expires_at) VALUES (?, ?, ?)",
          [email, otp, expiresAt]
      );
  
      // Send OTP via email or log it
      const content = `Here is your OTP CODE: ${otp}`;
      await sendEmail(content, email);

      return {code: 200, message: 'OTP sent successfully!!!'}
  }
    
  static async verifyOTP(email, enteredOtp, name, password) {
    // 1. Tìm OTP còn hạn và chưa dùng
    const [rows] = await db.query(
      "SELECT * FROM otps WHERE user_email = ? AND otp_code = ? AND is_used = FALSE AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
      [email, enteredOtp]
    );
  
    if (!rows.length) return { code: 403, message: "Invalid or expired OTP" };
  
    // 2. Đánh dấu đã sử dụng OTP
    await db.query(
      "UPDATE otps SET is_used = TRUE WHERE id = ?",
      [rows[0].id]
    );
  
    // 3. Mã hoá mật khẩu rồi tạo user
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO users (email, full_name, password_hash) VALUES (?, ?, ?)`,
      [email, name, hashedPassword]
    );
  
    return { code: 200, message: "Success" };
  }

  static async checkLogin(name, pw){
    const [rows] = await db.query(
      "SELECT * FROM users WHERE full_name = ?",
      [name]
    );
    if (!rows.length) return { code: 403, message: "Invalid username or password" };
    const user = rows[0];
    const isMatch = await bcrypt.compare(pw, user.password_hash);
  
    if (!isMatch) return { code: 403, message: "Invalid username or password" };
  
    // Generate JWT token
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    return { code: 200, message: "Login successful", token };
  }

  static async getUsers(){
    const [rows] = await db.query(
      "SELECT * FROM users"
    );
    if (!rows.length) return { code: 404, message: "No users found" };
    return { code: 200, message: "Success", data: rows };
  }
  
  static async makeAppointment(userId, appointmentDate, doctorId) {
    // Check if the user exists
    const [userRows] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
    if (!userRows.length) return { code: 404, message: "User not found" };
  
    // Insert appointment into the database
    await db.query(
      "INSERT INTO appointments (patient_id, appointment_time, doctor_id) VALUES (?, ?, ?)",
      [userId, appointmentDate, doctorId]
    );
  
    return { code: 200, message: "Appointment created successfully" };
  }

  static async cancelAppointment(userId, appointmentId) {
    // Check if the user exists
    const [userRows] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
    if (!userRows.length) return { code: 404, message: "User not found" };
  
    // Delete appointment from the database
    const result = await db.query(
      "DELETE FROM appointments WHERE appointment_id = ? AND user_id = ?",
      [appointmentId, userId]
    );
  
    if (result.affectedRows === 0) return { code: 404, message: "Appointment not found" };
  
    return { code: 200, message: "Appointment canceled successfully" };
  }

  static async addMedicine(name, description, quantity, unit, price) {
    // Check if the medicine already exists
    const [existingRows] = await db.query("SELECT * FROM medicines WHERE name = ?", [name]);
    if (existingRows.length) return { code: 409, message: "Medicine already exists" };
  
    // Insert new medicine into the database
    await db.query(
      "INSERT INTO medicines (name, description, quantity, unit, price) VALUES (?, ?, ?, ?, ?)",
      [name, description, quantity, unit, price]
    );
  
    return { code: 200, message: "Medicine added successfully" };
  }
}



module.exports = UserService;