const db = require('../config/db');

class InvoiceService {
  static async createInvoice(appointmentId, recordId, items, total, paymentMethod, paymentStatus) {
    try {
      // Check if appointment exists
      const [appointmentRows] = await db.query(
        "SELECT * FROM appointments WHERE appointment_id = ?",
        [appointmentId]
      );
      if (!appointmentRows.length) return { code: 404, message: "Appointment not found" };

      // Check if medical record exists
      const [recordRows] = await db.query(
        "SELECT * FROM medical_records WHERE record_id = ?",
        [recordId]
      );
      if (!recordRows.length) return { code: 404, message: "Medical record not found" };

      // Create invoice
      const [result] = await db.query(
        "INSERT INTO invoices (appointment_id, total_amount, payment_method, payment_status) VALUES (?, ?, ?, ?)",
        [appointmentId, total, paymentMethod, paymentStatus]
      );

      return { code: 201, message: "Invoice created successfully", invoice_id: result.insertId };
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

  static async getCompletedAppointments() {
    try {
      const [rows] = await db.query(
        `SELECT 
            a.appointment_id, 
            a.appointment_time, 
            a.status, 
            d.full_name AS doctor_name, 
            p.full_name AS patient_name, 
            i.invoice_id,
            i.total_amount,
            mr.record_id,
            mr.diagnosis,
            mr.prescription,
            mr.note AS medical_note,
            mr.created_at AS medical_record_created_at
        FROM appointments a
        JOIN users d ON a.doctor_id = d.user_id
        JOIN users p ON a.patient_id = p.user_id
        LEFT JOIN invoices i ON a.appointment_id = i.appointment_id
        LEFT JOIN medical_records mr ON a.appointment_id = mr.appointment_id
        WHERE a.status = 'completed'`
      );
      return { code: 200, data: rows };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }
  static async getPrescriptionByRecordId(record_id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM prescriptions WHERE record_id = ?`,
        [record_id]
      );
      if (!rows.length) return { code: 404, message: "Medical record not found" };
      return { code: 200, data: rows};
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }

  static async getMedicalRecordByAppointmentId(appointment_id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM medical_records WHERE appointment_id = ?`,
        [appointment_id]
      );
      if (!rows.length) return { code: 404, message: "Medical record not found" };
      return { code: 200, data: rows[0] };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }

  static async getAllInvoices() {
    try {
      const [rows] = await db.query(
        `SELECT 
            i.invoice_id, 
            i.appointment_id, 
            i.total_amount, 
            i.payment_method, 
            i.payment_status, 
            i.issued_at,
            a.appointment_time, 
            d.full_name AS doctor_name, 
            p.full_name AS patient_name
        FROM invoices i
        JOIN appointments a ON i.appointment_id = a.appointment_id
        JOIN users d ON a.doctor_id = d.user_id
        JOIN users p ON a.patient_id = p.user_id`
      );
      return { code: 200, data: rows };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }

  static async editInvoice(invoice_id, paymentStatus, total) {
    try {
      const [invoiceRows] = await db.query(
        "SELECT * FROM invoices WHERE invoice_id = ?",
        [invoice_id]
      );
      if (!invoiceRows.length) return { code: 404, message: "Invoice not found" };

      await db.query(
        "UPDATE invoices SET payment_status = ?, total_amount = ? WHERE invoice_id = ?",
        [paymentStatus, total, invoice_id]
      );

      return { code: 200, message: "Invoice updated successfully" };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }
}

module.exports = InvoiceService;
