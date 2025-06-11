"use strict";

const db = require('../config/db');

class AppointmentService {
  static async getAppointments(userId) {
      try {
          const [rows] = await db.query(
              `SELECT a.*, u.full_name AS doctor_name
              FROM appointments a
              JOIN users u ON a.doctor_id = u.user_id
              WHERE a.patient_id = ?`,
              [userId]
          );
          return { code: 200, data: rows };
      } catch (err) {
          console.error(err);
          throw new Error('Database error');
      }
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
      "DELETE FROM appointments WHERE appointment_id = ? AND patient_id = ?",
      [appointmentId, userId]
    );
  
    if (result.affectedRows === 0) return { code: 404, message: "Appointment not found" };
  
    return { code: 200, message: "Appointment canceled successfully" };
  }

  static async getAllAppointments() {
    try {
      const [rows] = await db.query(`SELECT 
          a.appointment_id,
          a.appointment_time,
          a.status,
          a.note,
          a.created_at,
          patient.full_name AS patient_name,
          doctor.full_name AS doctor_name
      FROM 
          appointments a
      JOIN 
          users patient ON a.patient_id = patient.user_id
      JOIN 
          users doctor ON a.doctor_id = doctor.user_id;`);
      return { code: 200, data: rows };
    } catch (error) {
      return { code: 500, message: error.message };
    }
  }

  static async updateAppointment(appointmentId, appointmentDate, doctorId, status) {
    try {
      await db.query(
        "UPDATE appointments SET appointment_time = ?, doctor_id = ? WHERE appointment_id = ?, status = ?",
        [appointmentDate, doctorId, appointmentId, status]
      );
      return { code: 200, message: "Appointment updated successfully" };
    } catch (error) {
      return { code: 500, message: error.message };
    }
  }
}    

module.exports = AppointmentService;
// This code defines a service for managing appointments in a database. It includes a method to retrieve all appointments for a specific user based on their user ID. The service uses a MySQL database connection to execute the query and handle any potential errors that may occur during the process.