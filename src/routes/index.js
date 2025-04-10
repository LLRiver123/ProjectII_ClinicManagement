const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.use("/access", require("./access"))


module.exports = router;
