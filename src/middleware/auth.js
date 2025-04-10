"use strict";

const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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
            id: user.id,
            username: user.username,
            email: user.email,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

module.exports = checkAuth;
