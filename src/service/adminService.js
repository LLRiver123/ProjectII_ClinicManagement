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

    // Add a new employee (must create user first)
    static async addEmployee(full_name, email, password, role, department, start_date) {
        if (!full_name || !email || !password || !role) {
            return { code: 400, message: "Missing required fields" };
        }
        try {
            // 1. Create user
            const hashedPassword = await bcrypt.hash(password, 10);
            const [userResult] = await db.query(
                'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
                [full_name, email, hashedPassword]
            );
            const user_id = userResult.insertId;

            // 2. Create employee
            const [empResult] = await db.query(
                'INSERT INTO employees (user_id, role, department, start_date, status) VALUES (?, ?, ?, ?, ?)',
                [user_id, role, department || null, start_date || new Date(), 'active']
            );
            return { code: 201, message: "Employee added successfully", employeeId: empResult.insertId };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }

    // Update employee (and optionally user)
    static async updateEmployee(employee_id, { full_name, email, password, role, department, start_date, status }) {
        try {
            // Get user_id from employee
            const [[emp]] = await db.query('SELECT user_id FROM employees WHERE employee_id = ?', [employee_id]);
            if (!emp) return { code: 404, message: "Employee not found" };

            // Update user info if provided
            if (full_name || email || password) {
                let updateFields = [];
                let params = [];
                if (full_name) { updateFields.push('full_name = ?'); params.push(full_name); }
                if (email) { updateFields.push('email = ?'); params.push(email); }
                if (password) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    updateFields.push('password = ?'); params.push(hashedPassword);
                }
                if (updateFields.length > 0) {
                    await db.query(
                        `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
                        [...params, emp.user_id]
                    );
                }
            }

            // Update employee info
            let empFields = [];
            let empParams = [];
            if (role) { empFields.push('role = ?'); empParams.push(role); }
            if (department) { empFields.push('department = ?'); empParams.push(department); }
            if (start_date) { empFields.push('start_date = ?'); empParams.push(start_date); }
            if (status) { empFields.push('status = ?'); empParams.push(status); }
            if (empFields.length > 0) {
                await db.query(
                    `UPDATE employees SET ${empFields.join(', ')} WHERE employee_id = ?`,
                    [...empParams, employee_id]
                );
            }

            return { code: 200, message: "Employee updated successfully" };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }

    static async deleteEmployee(employee_id) {
        try {
            // Get user_id to delete user as well
            const [[emp]] = await db.query('SELECT user_id FROM employees WHERE employee_id = ?', [employee_id]);
            if (!emp) return { code: 404, message: "Employee not found" };

            await db.query('DELETE FROM employees WHERE employee_id = ?', [employee_id]);
            await db.query('DELETE FROM users WHERE user_id = ?', [emp.user_id]);
            return { code: 200, message: "Employee and user deleted successfully" };
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

    static async addSchedule({ employee_id, work_date, shift, note = 'Lịch làm việc' }) {
        if (!employee_id || !work_date || !shift) {
            return { code: 400, message: "Missing required fields" };
        }
        try {
            const [result] = await db.query(
                'INSERT INTO schedules (employee_id, work_date, shift, note) VALUES (?, ?, ?, ?)',
                [employee_id, work_date, shift, note]
            );
            return { code: 201, message: "Schedule added successfully", scheduleId: result.insertId };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }   


    static async updateSchedule({ employee_id, work_date, shift , note}) {
        try {
            const [result] = await db.query(
                'UPDATE schedules SET employee_id = ?, work_date = ?, shift = ? WHERE note = ?',
                [employee_id, work_date, shift,note]
            );

            if (result.affectedRows === 0) {
                return { code: 404, message: "Schedule not found or no change made" };
            }

            return { code: 200, message: "Schedule updated successfully" };
        } catch (error) {
            return { code: 500, message: error.message };
        }
    }

    static async deleteSchedule(schedule_id) {
        try {
            const [result] = await db.query('DELETE FROM schedules WHERE schedule_id = ?', [schedule_id]);
            if (result.affectedRows === 0) {
                return { code: 404, message: "Schedule not found" };
            }
            return { code: 200, message: "Schedule deleted successfully" };
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
