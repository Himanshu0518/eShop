"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaildateLogin = exports.VaildateSignup = void 0;
const zod_1 = require("zod");
const utils_1 = require("../utils/utils");
// User Signup Validation Schema
exports.VaildateSignup = (0, utils_1.asyncHandler)(async (req, res, next) => {
    const user = req.body;
    const SignupSchema = zod_1.z.object({
        name: zod_1.z.string().trim().min(3, 'Name must be at least 3 characters long'),
        email: zod_1.z.email('Invalid email address'),
        password: zod_1.z.string().trim().min(6, 'Password must be at least 6 characters long'),
        confirmPassword: zod_1.z.string().trim().min(6, 'Password must be at least 6 characters long'),
        img: zod_1.z.string().trim().optional(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
    const result = await SignupSchema.safeParseAsync(user);
    if (!result.success) {
        const formattedErrors = zod_1.z.flattenError(result.error).fieldErrors;
        res.status(400).json({
            success: false,
            message: result.error.message,
            errors: formattedErrors,
        });
    }
    else {
        next();
    }
});
// User Login Validation Schema
exports.VaildateLogin = (0, utils_1.asyncHandler)(async (req, res, next) => {
    const user = req.body;
    const LoginSchema = zod_1.z.object({
        email: zod_1.z.email('Invalid email address'),
        password: zod_1.z.string().trim().min(6, 'Password must be at least 6 characters long'),
    });
    const result = await LoginSchema.safeParseAsync(user);
    if (!result.success) {
        const formattedErrors = zod_1.z.flattenError(result.error).fieldErrors;
        res.status(400).json({
            success: false,
            message: result.error.message,
            errors: formattedErrors,
        });
    }
    else {
        next();
    }
});
