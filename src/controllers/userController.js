"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserService = require("../service/userService");
const {asyncHandler} = require("../middleware/asyncHandler");
// const {checkAuth, isAdmin} = require("../middleware/auth");

class UserController{
    getUsers = asyncHandler(async (req, res) => {
        const users = await UserService.getUsers();
        return res.status(200).json(users);
        });
    
    makeAppointment = asyncHandler(async (req, res) => {
        const { userId, appointmentDate, doctorId } = req.body;
        if (!userId || !appointmentDate) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        const result = await UserService.makeAppointment(userId, appointmentDate, doctorId);
        return res.status(result.code).json(result);
        });
    
    cancelAppointment = asyncHandler(async (req, res) => {
        const { userId, appointmentId} = req.body;
        if (!userId || !appointmentId) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        const result = await UserService.cancelAppointment(userId, appointmentId);
        return res.status(result.code).json(result);
        });

    addMedicine = asyncHandler(async (req, res) => {
        const { name, description, quantity, unit, price } = req.body;
        if (!name || !description || !price || !quantity || !unit) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await UserService.addMedicine(name, description, quantity, unit, price);
        return res.status(result.code).json(result);
    });    

    updateMedicine = asyncHandler(async (req, res) => {
        const {medicineId, name, description, quantity, unit, price} = req.body;
        if (!medicineId || !name || !description || !quantity || !unit || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }else {
            const result = await UserService.updateMedicine(medicineId, name, description, quantity, unit, price);
            return res.status(result.code).json(result);
        }
    })
}

module.exports = new UserController();