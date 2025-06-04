"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserService = require("../service/userService");
const LogService = require("../service/logService");
const MedicineService = require("../service/medicineService");
const AppointmentService = require("../service/appointmentService");
const {asyncHandler} = require("../middleware/asyncHandler");
// const {checkAuth, isAdmin} = require("../middleware/auth");

class UserController{
    getUsers = asyncHandler(async (req, res) => {
        const users = await UserService.getUsers();
        return res.status(200).json(users);
        });

    deleteUser = asyncHandler(async (req, res) => {
        const { userId } = req.body;    
        if (!userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await UserService.deleteUser(userId);
        if (result.code !== 200) {
            await LogService.createLog("Delete user failed", result.message, "error");
            return res.status(result.code).json(result);
        }
        await LogService.createLog("Delete user success", result.message, "success");
        return res.status(result.code).json(result);
        });    

    updateRole = asyncHandler(async (req, res) => {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await UserService.updateRole(userId, role);
        if (result.code !== 200) {
            await LogService.createLog("Update role failed", result.message, "error");
            return res.status(result.code).json(result);
        }
        await LogService.createLog("Update role success", result.message, "success");
        return res.status(result.code).json(result);
        });    
    
    makeAppointment = asyncHandler(async (req, res) => {
        const { userId, appointmentDate, doctorId } = req.body;
        if (!userId || !appointmentDate) {
          await LogService.createLog("Make appointment failed", "Missing required fields", "error");
          return res.status(400).json({ message: "Missing required fields" });
        }
        if (!doctorId) {
            await LogService.createLog("Make appointment failed", "Doctor ID is required", "error");
            return res.status(400).json({ message: "Doctor ID is required" });
        }
        const result = await AppointmentService.makeAppointment(userId, appointmentDate, doctorId);
        if (result.code !== 200) {
            await LogService.createLog("Make appointment failed", result.message, "error");
            return res.status(result.code).json(result);
        }
        return res.status(result.code).json(result);
        });
    
    cancelAppointment = asyncHandler(async (req, res) => {
        const { userId, appointmentId} = req.body;
        if (!userId || !appointmentId) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        const result = await AppointmentService.cancelAppointment(userId, appointmentId);
        return res.status(result.code).json(result);
        });

    getAppointments = asyncHandler(async (req, res) => {
        const { userId } = req.body;    
        if (!userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const appointments = await AppointmentService.getAppointments(userId);
        if (appointments.code !== 200) {
            await LogService.createLog("Get appointments failed", appointments.message, "error");
            return res.status(appointments.code).json(appointments);
        }
        await LogService.createLog("Get appointments success", "Fetched appointments successfully", "success");
        return res.status(appointments.code).json(appointments);
    });    

    addMedicine = asyncHandler(async (req, res) => {
        const { name, description, quantity, unit, price } = req.body;
        if (!name || !description || !price || !quantity || !unit) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await MedicineService.addMedicine(name, description, quantity, unit, price);
        if (result.code !== 200) {
            await LogService.createLog("Add medicine failed", result.message, "error");
            return res.status(result.code).json(result);
        }
        await LogService.createLog("Add medicine success", result.message, "success");
        return res.status(result.code).json(result);
    });    

    updateMedicine = asyncHandler(async (req, res) => {
        const {medicineId, name, description, quantity, unit, price} = req.body;
        if (!medicineId || !name || !description || !quantity || !unit || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }else {
            const result = await MedicineService.updateMedicine(medicineId, name, description, quantity, unit, price);
            if (result.code !== 200) {
                await LogService.createLog("Update medicine failed", result.message, "error");
            }
            await LogService.createLog("Update medicine success", result.message, "success");
            return res.status(result.code).json(result);
        }
    })
    getMedicines = asyncHandler(async (req, res) => {
        const medicines = await MedicineService.getMedicines();
        return res.status(200).json(medicines);
    });
    deleteMedicine = asyncHandler(async (req, res) => {
        const { medicineId } = req.body;
        if (!medicineId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await MedicineService.deleteMedicine(medicineId);
        if (result.code !== 200) {
            await LogService.createLog("Delete medicine failed", result.message, "error");
            return res.status(result.code).json(result);
        }
        await LogService.createLog("Delete medicine success", result.message, "success");
        return res.status(result.code).json(result);
    });


}

module.exports = new UserController();