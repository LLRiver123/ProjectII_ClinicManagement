const express = require('express')
const cron = require("node-cron");

require('dotenv').config()

const app = express()
const port = 3000

const routes = require('./src/routes/index')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
app.listen(port, ()=>{
    console.log(`Server running on ${port}`)
})

app.use((err, req, res, next) => {
    console.error("💥 Error:", err.stack);
    res.status(err.statusCode || 500).json({
        error: true,
        message: err.message || "Đã có lỗi xảy ra!"
    });
});

cron.schedule("*/5 * * * *", async () => {
  try {
    const [result] = await db.query(`
      UPDATE appointments
      SET status = 'cancelled'
      WHERE status = 'confirmed' AND appointment_time < NOW()
    `);
    console.log(`Auto-cancelled ${result.affectedRows} appointment(s).`);
  } catch (err) {
    console.error("Error auto-cancelling appointments:", err);
  }
});

cron.schedule('0 0 * * *', async () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    try {
        await AdminService.addDailySchedulesForAllEmployees(today);
        console.log('Daily schedules created for all employees');
    } catch (err) {
        console.error('Failed to create daily schedules:', err);
    }
});