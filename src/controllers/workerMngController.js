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
        const { full_name, email, password, role, department, start_date } = req.body;
        const result = await AdminService.addEmployee(full_name, email, password, role, department, start_date);
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
        const result = await AdminService.updateEmployee(id, req.body);
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

    addSchedule = asyncHandler(async (req, res) => {
        const scheduleData = req.body;
        const result = await AdminService.addSchedule(scheduleData);
        if (result.code !== 201) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Add schedule success");
        res.status(result.code).json(result);
    });

    updateSchedule = asyncHandler(async (req, res) => {
        const scheduleData = req.body;
        const result = await AdminService.updateSchedule(scheduleData);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Update schedule success");
        res.status(result.code).json(result);
    });

    deleteSchedule = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await AdminService.deleteSchedule(id);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Delete schedule success");
        res.status(result.code).json(result);
    });
    getSystemLogs = asyncHandler(async (req, res) => {
        const result = await LogService.getSystemLogs();
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, result.message);
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Get system logs success");
        res.status(result.code).json(result);
    });
}

module.exports = new WorkerMngController();