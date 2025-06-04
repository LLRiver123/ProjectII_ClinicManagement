"use strict";

const db = require('../config/db');

class AdminService {
    static getAllEmployees() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM employees', (error, results) => {
            if (error) return reject({ code: 500, message: error.message });
            resolve({ code: 200, data: results });
        });
    });
}

    static addEmployee(name, email, password, role) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO employees (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, password, role],
                (error, results) => {
                    if (error) return reject({ code: 500, message: error.message });
                    resolve({ code: 201, message: "Employee added successfully" });
                }
            );
        });
    }

    static updateEmployee(id, employeeData) {
        return new Promise((resolve, reject) => {   
            db.query(
                'UPDATE employees SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
                [employeeData.name, employeeData.email, employeeData.password, employeeData.role, id],
                (error, results) => {
                    if (error) return reject({ code: 500, message: error.message });
                    resolve({ code: 200, message: "Employee updated successfully" });
                }
            );
        });
    }
    static deleteEmployee(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM employees WHERE id = ?', [id], (error, results) => {
                if (error) return reject({ code: 500, message: error.message });
                resolve({ code: 200, message: "Employee deleted successfully" });
            });
        });
    }
    // Get all schedules
    static getAllSchedules() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM schedules', (error, results) => {
                if (error) return reject(error);
                resolve({ code: 200, data: results });
            });
        });
    }
    static addDailySchedulesForAllEmployees(work_date, shift = 'morning') {
    return new Promise((resolve, reject) => {
        // Only add for active employees
        db.query(
            `INSERT INTO schedules (employee_id, work_date, shift)
             SELECT employee_id, ?, ? FROM employees WHERE status = 'active'`,
            [work_date, shift],
            (error, results) => {
                if (error) return reject({ code: 500, message: error.message });
                resolve({ code: 201, message: "Schedules added for all employees" });
            }
        );
    });
}
}

module.exports = AdminService;
