"use strict";

const db = require('../config/db');

class CheckupService {
  static async getAllCheckUps() {
    try {
      const [rows] = await db.query('SELECT * FROM medical_records');
      return { code: 200, data: rows, message: 'Checkups fetched successfully' };
    } catch (err) {
      console.error(err);
      throw new Error('Database error');
      return { code: 500, message: 'Internal server error' };
    }
  }
  static async addCheckUp(appointmentId,diagnosis, prescription,note) {
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

  static async addPrescription(recordId, prescriptions) {
    if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
        return { code: 400, message: "No prescriptions provided" };
    }
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        for (const pres of prescriptions) {
            const { medicineId, quantity, instructions } = pres;
            if (!medicineId || !quantity) {
                await conn.rollback();
                return { code: 400, message: "Missing medicineId or quantity in prescription" };
            }
            await conn.query(
                "INSERT INTO prescriptions (record_id, medicine_id, quantity, instruction) VALUES (?, ?, ?, ?)",
                [recordId, medicineId, quantity, instructions || null]
            );
        }
        await conn.commit();
        return { code: 200, message: "Prescriptions added successfully" };
    } catch (error) {
        await conn.rollback();
        return { code: 500, message: error.message };
    } finally {
        conn.release();
    }
  }

}

module.exports = CheckupService;