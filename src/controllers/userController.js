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
            await LogService.createLog(req.user?.id, "Delete user failed: " );
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Delete user success");
        return res.status(result.code).json(result);
        });    

    updateRole = asyncHandler(async (req, res) => {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await UserService.updateRole(userId, role);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, "Update role failed: ");
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Update role success");
        return res.status(result.code).json(result);
        });    

    updateUser = asyncHandler(async (req, res) => {
        const { userId, fullName, email, phone, role, status } = req.body;
        const result = await UserService.updateUser(userId, fullName, email, phone, role, status);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, "Update user failed: ");
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Update user success");
        return res.status(result.code).json(result);
    });    
    
    makeAppointment = asyncHandler(async (req, res) => {
        const { userId, appointmentDate, doctorId } = req.body;
        if (!userId || !appointmentDate) {
          await LogService.createLog(req.user?.id, "Make appointment failed: Missing required fields");
          return res.status(400).json({ message: "Missing required fields" });
        }
        if (!doctorId) {
            await LogService.createLog("Make appointment failed", "Doctor ID is required", "error");
            return res.status(400).json({ message: "Doctor ID is required" });
        }
        const result = await AppointmentService.makeAppointment(userId, appointmentDate, doctorId);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, "Make appointment failed: " );
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
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, "Cancel appointment failed: ");
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Cancel appointment success");
        return res.status(result.code).json(result);
        });

    getAppointments = asyncHandler(async (req, res) => {
        const { userId } = req.body;    
        if (!userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const appointments = await AppointmentService.getAppointments(userId);
        if (appointments.code !== 200) {
            await LogService.createLog(req.user?.id, "Get appointments failed: ");
            return res.status(appointments.code).json(appointments);
        }
        await LogService.createLog(req.user?.id, "Get appointments success");
        return res.status(appointments.code).json(appointments);
    }); 
    
    getDoctors = asyncHandler(async (req, res) => {
        const doctors = await UserService.getDoctors();
        if (doctors.code !== 200) {
            await LogService.createLog(req.user?.id, "Get doctors failed: ");
            return res.status(doctors.code).json(doctors);
        }
        await LogService.createLog(req.user?.id, "Get doctors success");
        return res.status(doctors.code).json(doctors);
    });

    getAllAppointments = asyncHandler(async (req, res) => {
        const appointments = await AppointmentService.getAllAppointments();
        if (appointments.code !== 200) {
            await LogService.createLog(req.user?.id, "Get all appointments failed: ");
            return res.status(appointments.code).json(appointments);
        }
        await LogService.createLog(req.user?.id, "Get all appointments success");
        return res.status(appointments.code).json(appointments);
    });

    addMedicine = asyncHandler(async (req, res) => {
        const { name, description, quantity, unit, price } = req.body;
        if (!name || !description || !price || !quantity || !unit) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await MedicineService.addMedicine(name, description, quantity, unit, price);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, "Add medicine failed");
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Add medicine success" );
        return res.status(result.code).json(result);
    });    

    updateMedicine = asyncHandler(async (req, res) => {
        const {medicineId, name, description, quantity, unit, price} = req.body;
        
        const result = await MedicineService.updateMedicine(medicineId, name, description, quantity, unit, price);
        if (result.code !== 200) {
            await LogService.createLog(req.user?.id, "Update medicine failed");
        }
        await LogService.createLog(req.user?.id, "Update medicine success");
        return res.status(result.code).json(result);
        
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
            await LogService.createLog(req.user?.id, "Delete medicine failed: ");
            return res.status(result.code).json(result);
        }
        await LogService.createLog(req.user?.id, "Delete medicine success");
        return res.status(result.code).json(result);
    });
    getInvoiceByAppointmentId = asyncHandler(async (req, res) => {
        userId = req.user?.id;
        const { appointmentId } = req.params;
        if (!appointmentId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const invoice = await AppointmentService.getInvoiceByAppointmentId(appointmentId, userId);
        if (invoice.code !== 200) {
            await LogService.createLog(req.user?.id, "Get invoice failed: ");
            return res.status(invoice.code).json(invoice);
        }
        await LogService.createLog(req.user?.id, "Get invoice success");
        return res.status(invoice.code).json(invoice);
    });


}

module.exports = new UserController();