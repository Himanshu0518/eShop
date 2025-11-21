"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfile = exports.GetUserProfile = exports.LogoutUser = exports.LoginUser = exports.SignupUser = void 0;
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
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
            success: true,
            message: "User logged in successfully",
            data: existingUser
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
const LogoutUser = (0, utils_1.asyncHandler)(async (req, res) => { });
exports.LogoutUser = LogoutUser;
const GetUserProfile = (0, utils_1.asyncHandler)(async (req, res) => { });
exports.GetUserProfile = GetUserProfile;
const UpdateUserProfile = (0, utils_1.asyncHandler)(async (req, res) => { });
exports.UpdateUserProfile = UpdateUserProfile;
