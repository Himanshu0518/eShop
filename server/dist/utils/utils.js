"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeString = exports.deleteFromCloudinary = exports.uploadToCloudinary = exports.verifyAuthToken = exports.createAuthToken = exports.comparePassword = exports.hashPassword = exports.asyncHandler = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            res.status(error?.statusCode || 500).json({
                success: false,
                error: error?.message || "Internal Server Error",
            });
        }
    };
};
exports.asyncHandler = asyncHandler;
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    return await bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
const createAuthToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
exports.createAuthToken = createAuthToken;
const verifyAuthToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyAuthToken = verifyAuthToken;
const uploadToCloudinary = async (localfilePath) => {
    console.log(localfilePath);
    try {
        const uploadResult = await cloudinary_1.v2.uploader
            .upload(localfilePath, {
            resource_type: "auto",
        });
        fs_1.default.unlinkSync(localfilePath);
        return uploadResult;
    }
    catch {
        fs_1.default.unlinkSync(localfilePath);
        return null;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    try {
        const deleteResult = await cloudinary_1.v2.uploader.destroy(publicId);
        return deleteResult;
    }
    catch {
        return null;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
const NormalizeString = (str) => {
    const strArray = Array.isArray(str)
        ? str
        : typeof str === 'string'
            ? str.split(',').map(c => c.trim())
            : [str];
    return strArray;
};
exports.NormalizeString = NormalizeString;
