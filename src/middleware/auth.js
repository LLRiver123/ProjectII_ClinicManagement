"use strict";

const jwt = require("jsonwebtoken");
const UserService = require("../service/userService");
const { asyncHandler } = require("../middleware/asyncHandler");

const JWT_SECRET = process.env.JWT_SECRET;

const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có token truy cập" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserService.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại" });
        }

        req.user = {
            id: user.user_id,
            username: user.full_name,
            email: user.email,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("authHeader:", authHeader);
        return res.status(401).json({ message: "Không có token truy cập" });
    }
   
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserService.findById(decoded.id);
        console.log("decoded", decoded);

        if (!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại" });
        }

        req.user = {
            id: user.user_id,
            username: user.full_name,
            email: user.email,
        };

        if(user.role != 'admin'){
            return res.status(403).json({message:"Không có quyền truy cập"})
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

module.exports = {isAdmin, checkAuth};
