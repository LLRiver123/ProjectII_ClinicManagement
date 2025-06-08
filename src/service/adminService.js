"use strict";

const db = require('../config/db');
const bcrypt = require('bcryptjs');

class AdminService {
    static async getAllEmployees() {
    try {
        const [rows] = await db.query(`
            SELECT 
                e.employee_id,
                e.role,
                e.department,
                e.start_date,
                e.status,
                u.user_id,
                u.full_name,
                u.email,
                u.phone
            FROM employees e
            JOIN users u ON e.user_id = u.user_id
        `);
        return { code: 200, data: rows, message: "Employees fetched successfully" };
    } catch (error) {
        return { code: 500, message: error.message };
    }
}


    static async addEmployee(name, email, password, role) {
        if (!name || !email || !password || !role) {
            return { code: 400, message: "Missing required fields" };
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.query(
                'INSERT INTO employees (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role]
            );
            return { code: 201, message: "Employee added successfully", employeeId: result.insertId };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }

    static async updateEmployee(id, { name, email, password, role }) {
        try {
            hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            const [result] = await db.query(
                'UPDATE employees SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
                [name, email, hashedPassword, role, id]
            );
            if (result.affectedRows === 0) return { code: 404, message: "Employee not found" };

            return { code: 200, message: "Employee updated successfully" };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }

    static async deleteEmployee(id) {
        try {
            const [result] = await db.query('DELETE FROM employees WHERE id = ?', [id]);
            if (result.affectedRows === 0) return { code: 404, message: "Employee not found" };

            return { code: 200, message: "Employee deleted successfully" };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }

    // Get all schedules
    static async getAllSchedules() {
        try {
            const [rows] = await db.query('SELECT * FROM schedules');
            return { code: 200, data: rows };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }


    static async updateSchedule(id, { employee_id, work_date, shift }) {
        try {
            const [result] = await db.query(
                'UPDATE schedules SET employee_id = ?, work_date = ?, shift = ? WHERE id = ?',
                [employee_id, work_date, shift, id]
            );

            if (result.affectedRows === 0) {
                return { code: 404, message: "Schedule not found or no change made" };
            }

            return { code: 200, message: "Schedule updated successfully" };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }


    static async addDailySchedulesForAllEmployees(work_date, shift = 'morning') {
        try {
            const [employees] = await db.query(
                `SELECT id, role FROM employees WHERE status = 'active'`
            );

            const scheduleData = employees.map(emp => {
                let note = 'Lịch làm việc';
                if (emp.role === 'doctor') note = 'Khám bệnh';
                else if (emp.role === 'receptionist') note = 'Tiếp tân';
                else if (emp.role === 'admin') note = 'Quản lý hành chính';

                return [emp.id, work_date, shift, note];
            });

            if (scheduleData.length === 0) {
                return { code: 200, message: "Không có nhân viên nào để tạo lịch." };
            }

            await db.query(
                `INSERT INTO schedules (employee_id, work_date, shift, note) VALUES ?`,
                [scheduleData]
            );

            return { code: 201, message: "Schedules added for all active employees" };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }

    static async getAllLogs() {
        try {
            const [rows] = await db.query('SELECT * FROM logs');
            return { code: 200, data: rows, message: "Logs fetched successfully" };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }
}

module.exports = AdminService;
