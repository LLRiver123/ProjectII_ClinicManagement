"use strict"; 

const express = require('express');
const router = express.Router();
const InvoiceController = require('../../controllers/invoiceController');
const { isAdmin, checkAuth } = require('../../middleware/auth');

router.post('/',checkAuth,  InvoiceController.createInvoice);
router.put('/pay/:invoice_id', checkAuth, InvoiceController.payInvoice);

module.exports = router;
