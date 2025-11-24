"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfile = exports.GetCurrentUser = exports.LogoutUser = exports.LoginUser = exports.SignupUser = void 0;
const db_1 = require("../config/db");
const utils_1 = require("../utils/utils");
const utils_2 = require("../utils/utils");
const SignupUser = (0, utils_1.asyncHandler)(async (req, res) => {
    const user = req.body;
    try {
        const existingUser = await db_1.prisma.user.findUnique({
            where: {
                email: user.email
            }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }
        const hashedPassword = await (0, utils_2.hashPassword)(user.password);
        const newUser = await db_1.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                img: user.img
            }
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to create user: ${error.message}`,
        });
    }
});
exports.SignupUser = SignupUser;
const LoginUser = (0, utils_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await db_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordMatch = await (0, utils_2.comparePassword)(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials please check and try again"
            });
        }
        const accessToken = (0, utils_2.createAuthToken)(String(existingUser.id));
        const options = {
            httpOnly: true,
            secure: true,
        };
        const user_db = await db_1.prisma.user.findUnique({
            where: { email: email },
            select: {
                name: true,
                email: true,
                img: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
            success: true,
            message: "User logged in successfully",
            data: { ...user_db, token: accessToken }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to login user: ${error.message}`,
        });
    }
});
exports.LoginUser = LoginUser;
const LogoutUser = (0, utils_1.asyncHandler)(async (_, res) => {
    return res
        .status(200)
        .clearCookie("accessToken")
        .json({
        success: true,
        message: "User logged out successfully"
    });
});
exports.LogoutUser = LogoutUser;
const GetCurrentUser = (0, utils_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const currentUser = {
        token: user?.token,
        name: user?.name,
        email: user?.email,
        img: user?.img,
        isAdmin: user?.isAdmin,
        createdAt: String(user?.createdAt),
        updatedAt: String(user?.updatedAt)
    };
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Current user fetched successfully",
        data: currentUser
    });
});
exports.GetCurrentUser = GetCurrentUser;
const UpdateUserProfile = (0, utils_1.asyncHandler)(async (req, res) => { });
exports.UpdateUserProfile = UpdateUserProfile;
