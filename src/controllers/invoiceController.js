const { asyncHandler } = require('../middleware/asyncHandler');
const InvoiceService = require('../service/invoiceService');

class InvoiceController {
  // Create a new invoice
  createInvoice = asyncHandler (async (req, res) => {
    const { userId, appointmentId, amount } = req.body;
    if (!userId || !appointmentId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await InvoiceService.createInvoice(userId, appointmentId, amount);
    if (result.code !== 201) {
      return res.status(result.code).json(result);
    }
    res.status(result.code).json(result);
  });

    // Get all invoices
  getAllInvoices = asyncHandler(async (req, res) => {
    const result = await InvoiceService.getAllInvoices();
    if (result.code !== 200) {
      return res.status(result.code).json(result);
    }
    res.status(result.code).json(result);
  });

  payInvoice = asyncHandler(async (req, res) => {
    const { invoiceId, paymentMethod } = req.body;
    if (!invoiceId || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await InvoiceService.payInvoice(invoiceId, paymentMethod);
    if (result.code !== 200) {
      return res.status(result.code).json(result);
    }
    res.status(result.code).json(result);
  });
}  

module.exports = new InvoiceController();
