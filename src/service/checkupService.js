"use strict";

const db = require('../config/db');

class CheckupService {
  static async getAllCheckups() {
    try {
      const [rows] = await db.query('SELECT * FROM medical_records');
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error('Database error');
    }
  }
  static async addCheckup(appointmentId,diagnosis, prescription,note) {
    try {
      await db.query(
        'INSERT INTO medical_records (appointment_id, diagnosis, prescription, note) VALUES (?, ?, ?, ?)',
        [appointmentId, diagnosis, prescription, note]
      );
      return { code: 200, message: 'Checkup added successfully' };
    } catch (err) {
      console.error(err);
      throw new Error('Database error');
    }
  }

}

module.exports = CheckupService;