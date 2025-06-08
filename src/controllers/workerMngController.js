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
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message );
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id,"Get all employees success");
        res.status(result.code).json(result);
    });

    // Add a new employee
    addEmployee = asyncHandler(async (req, res) => {
        const { name, email, password, role } = req.body;
        // You may want to hash the password here if needed
        const result = await AdminService.addEmployee(name, email, password, role);
        if (result.code !== 201) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Add new employee success");
        res.status(result.code).json(result);
    });

    // Update an employee
    updateEmployee = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const employeeData = req.body;
        const result = await AdminService.updateEmployee(id, employeeData);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Update employee success");
        res.status(result.code).json(result);
    });

    // Delete an employee
    deleteEmployee = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await AdminService.deleteEmployee(id);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Delete employee success");
        res.status(result.code).json(result);
    });

    // Get all schedules
    getAllSchedules = asyncHandler(async (req, res) => {
        const result = await AdminService.getAllSchedules();
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Get all schedules success");
        res.status(result.code).json(result);
    });

    updateSchedule = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const scheduleData = req.body;
        const result = await AdminService.updateSchedule(id, scheduleData);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Update schedule success");
        res.status(result.code).json(result);
    });
}

module.exports = new WorkerMngController();