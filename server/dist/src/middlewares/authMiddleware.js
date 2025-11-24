"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyJWT = void 0;
const utils_1 = require("../utils/utils");
const db_1 = require("../config/db");
exports.VerifyJWT = (0, utils_1.asyncHandler)(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided, authorization denied",
        });
    }
    try {
        const decoded_token = (0, utils_1.verifyAuthToken)(token);
        const userId = decoded_token.userId;
        const user = await db_1.prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                email: true,
                name: true,
                img: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        req.user = { ...user, token: token };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: `Not authorized: ${error.message}`,
        });
    }
});
