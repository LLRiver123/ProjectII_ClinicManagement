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
    // Build dynamic query based on non-null fields
    const fields = [];
    const values = [];

    if (name !== null && name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (description !== null && description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (quantity !== null && quantity !== undefined) {
      fields.push("quantity = ?");
      values.push(quantity);
    }
    if (unit !== null && unit !== undefined) {
      fields.push("unit = ?");
      values.push(unit);
    }
    if (price !== null && price !== undefined) {
      fields.push("price = ?");
      values.push(price);
    }

    if (fields.length === 0) {
      return { code: 400, message: "No fields to update" };
    }

    values.push(medicineId);

    const query = `UPDATE medicines SET ${fields.join(", ")} WHERE medicine_id = ?`;
    await db.query(query, values);
    return { code: 200, message: "Medicine updated successfully" };
  }
  static async deleteMedicine(medicineId) {
    await db.query("DELETE FROM medicines WHERE medicine_id = ?", [medicineId]);
    return { code: 200, message: "Medicine deleted successfully" };
  }

}

module.exports = MedicineService;