const { asyncHandler } = require('../middleware/asyncHandler');
const InvoiceService = require('../service/invoiceService');
const AppointmentService = require('../service/appointmentService');
'use strict';

class InvoiceController {
  // Create a new invoice
  createInvoice = asyncHandler (async (req, res) => {
    const {appointmentId, recordId, items, total, paymentMethod, paymentStatus } = req.body;
    if (!appointmentId || !recordId || !items || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await InvoiceService.createInvoice(appointmentId, recordId, items, total, paymentMethod, paymentStatus);
    if (result.code !== 200) {
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

  getCompletedAppointments = asyncHandler(async (req, res) => {
    const result = await InvoiceService.getCompletedAppointments();
    if (result.code !== 200) {
      return res.status(result.code).json(result);
    }
    res.status(result.code).json(result);
  });

  getPrescriptionByRecordId = asyncHandler(async (req, res) => {
    const { recordId } = req.params;
      if (!recordId) {
        return res.status(400).json({ message: 'Missing record ID' });
      }
      const result = await InvoiceService.getPrescriptionByRecordId(recordId);
      if (result.code !== 200) {
        return res.status(result.code).json(result);
      }
      res.status(result.code).json(result);
    }
  );

  updateAppointment = asyncHandler(async (req, res) => {
    const {appointmentId, appointmentDate, doctorId, status} = req.body;
    if (!appointmentId || !appointmentDate || !doctorId || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await AppointmentService.updateAppointment(appointmentId, appointmentDate, doctorId, status);
    if (result.code !== 200) {
      return res.status(result.code).json(result);
    }
    res.status(result.code).json(result);
  }  
  );

  getMedicalRecordByAppointmentId = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ message: 'Missing appointment ID' });
    }
    const result = await InvoiceService.getMedicalRecordByAppointmentId(appointmentId);
    if (result.code !== 200) {
      return res.status(result.code).json(result);
    }
    res.status(result.code).json(result);
  } 
  );

  editInvoice = asyncHandler(async (req, res) => {
    const { invoiceId, paymentStatus, total } = req.body;
    if (!invoiceId || !paymentStatus || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await InvoiceService.editInvoice(invoiceId, paymentStatus, total);
    if (result.code !== 200) {
      return res.status(result.code).json(result);
    }
    res.status(result.code).json(result);
  });
}

module.exports = new InvoiceController();
