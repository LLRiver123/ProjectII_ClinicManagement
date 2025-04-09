const express = require('express')

require('dotenv').config()

const app = express()
const port = 3000

const studentRoutes = require('./routes/students')

app.use(express.json());
app.use('/students', studentRoutes)
app.listen(port, ()=>{
    console.log(`Server running on ${port}`)
})