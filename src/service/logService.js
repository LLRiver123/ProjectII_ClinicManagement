const db = require("../config/db");

class LogService {
  static async log(userId, action) {
    try {
      await db.query("INSERT INTO logs (user_id, action) VALUES (?, ?)", [userId, action]);
    } catch (err) {
      console.error("Logging failed:", err);
    }
  }
}

module.exports = LogService;
