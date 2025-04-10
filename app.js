const express = require('express')

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