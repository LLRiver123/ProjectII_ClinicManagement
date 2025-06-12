const db = require("../config/db");

class LogService {
  static async createLog(userId, action) {
    try {
      await db.query("INSERT INTO logs (user_id, action) VALUES (?, ?)", [userId, action]);
    } catch (err) {
      console.error("Logging failed:", err);
    }
  }
  static async getSystemLogs() {
    try {
      const [rows] = await db.query("SELECT * FROM logs ORDER BY created_at DESC");
      return { code: 200, data: rows };
    } catch (err) {
      console.error("Error fetching logs:", err);
      return { code: 500, message: "Internal server error" };
    }
  }
}

module.exports = LogService;
