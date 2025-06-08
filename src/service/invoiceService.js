const db = require('../config/db');

class InvoiceService {
  static async createInvoice(appointment_id, total_amount) {
    try {
      const [result] = await db.query(
        "INSERT INTO invoices (appointment_id, total_amount) VALUES (?, ?)",
        [appointment_id, total_amount]
      );
      return { code: 201, message: "Invoice created", invoice_id: result.insertId };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }

  static async payInvoice(invoice_id, payment_method) {
    try {
      const [invoiceRows] = await db.query(
        "SELECT * FROM invoices WHERE invoice_id = ?",
        [invoice_id]
      );
      if (!invoiceRows.length) return { code: 404, message: "Invoice not found" };

      await db.query(
        "UPDATE invoices SET payment_status = 'paid', payment_method = ? WHERE invoice_id = ?",
        [payment_method, invoice_id]
      );

      return { code: 200, message: "Payment successful" };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }

  static async getInvoiceById(invoice_id) {
    const [rows] = await db.query("SELECT * FROM invoices WHERE invoice_id = ?", [invoice_id]);
    return rows[0];
  }
}

module.exports = InvoiceService;
