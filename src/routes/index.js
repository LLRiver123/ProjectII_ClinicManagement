const express = require('express');
const router = express.Router();

router.use("/access", require("./access"));
router.use("/user", require("./user"));
router.use("/meds", require("./meds"));
router.use("/checkup", require("./checkup"));
router.use("/addmin", require("./addmin"));
router.use("/receptionist", require("./receptionist"));



module.exports = router;
