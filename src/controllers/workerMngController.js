"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AdminService = require("../service/adminService");
const LogService = require("../service/logService");
const { asyncHandler } = require("../middleware/asyncHandler");

class WorkerMngController {
    // Get all employees
    getAllEmployees = asyncHandler(async (req, res) => {
        const result = await AdminService.getAllEmployees();
        res.status(result.code).json(result);
    });

    // Add a new employee
    addEmployee = asyncHandler(async (req, res) => {
        const { name, email, password, role } = req.body;
        // You may want to hash the password here if needed
        const result = await AdminService.addEmployee(name, email, password, role);
        res.status(result.code).json(result);
    });

    // Update an employee
    updateEmployee = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const employeeData = req.body;
        const result = await AdminService.updateEmployee(id, employeeData);
        res.status(result.code).json(result);
    });

    // Delete an employee
    deleteEmployee = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await AdminService.deleteEmployee(id);
        res.status(result.code).json(result);
    });

    // Get all schedules
    getAllSchedules = asyncHandler(async (req, res) => {
        const result = await AdminService.getAllSchedules();
        res.status(result.code).json(result);
    });

    // You can add similar methods for addSchedule, updateSchedule, deleteSchedule if you add them to AdminService
}

module.exports = new WorkerMngController();