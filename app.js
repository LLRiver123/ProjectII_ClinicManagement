const express = require('express')
const cron = require("node-cron");
const AdminService = require('./src/service/adminService');
const db = require('./src/config/db');
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');


require('dotenv').config()

const app = express()
const port = 3500

const routes = require('./src/routes/index')

let lastRunDate = null;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn gốc
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'] // Các header được phép
}));
app.use("/", routes);

app.listen(port, ()=>{
    console.log(`Server running on ${port}`)
    console.log("Available endpoints:");
    listEndpoints(routes).forEach(endpoint => {
        console.log(`${endpoint.methods.join(', ')} ${endpoint.path}`);
    });
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

cron.schedule('*/10 * * * *', async () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (lastRunDate === today) {
        // Already executed today
        return;
    }

    try {
        await AdminService.addDailySchedulesForAllEmployees(today);
        lastRunDate = today;
        console.log(`[${new Date().toLocaleTimeString()}] Daily schedules created for all employees`);
    } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] Failed to create daily schedules:`, err);
    }
});