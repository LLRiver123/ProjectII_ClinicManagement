"use strict";

const db = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class MedicineService {
  static async getMedicines() {
    const [rows] = await db.query("SELECT * FROM medicines");
    return rows;
  }

  static async addMedicine(name, description, quantity, unit, price) {
    await db.query(
      "INSERT INTO medicines (name, description, quantity, unit, price) VALUES (?, ?, ?, ?, ?)",
      [name, description, quantity, unit, price]
    );
    return { code: 200, message: "Medicine added successfully" };
  }

  static async updateMedicine(medicineId, name, description, quantity, unit, price) {
    await db.query(
      "UPDATE medicines SET name = ?, description = ?, quantity = ?, unit = ?, price = ? WHERE medicine_id = ?",
      [name, description, quantity, unit, price, medicineId]
    );
    return { code: 200, message: "Medicine updated successfully" };
  }
  static async deleteMedicine(medicineId) {
    await db.query("DELETE FROM medicines WHERE medicine_id = ?", [medicineId]);
    return { code: 200, message: "Medicine deleted successfully" };
  }

}

module.exports = MedicineService;