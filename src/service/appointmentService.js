"use strict";

const db = require('../config/db');

class AppointmentService {
    async getAppointments(userId) {
        try {
            const [rows] = await db.query('SELECT * FROM appointments WHERE userId = ?', [userId]);
            return rows;
        } catch (err) {
            console.error(err);
            throw new Error('Database error');
        }
    }
}    

module.exports = new AppointmentService();
// This code defines a service for managing appointments in a database. It includes a method to retrieve all appointments for a specific user based on their user ID. The service uses a MySQL database connection to execute the query and handle any potential errors that may occur during the process.