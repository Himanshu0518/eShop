"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateProductAddition = exports.VaildateLogin = exports.VaildateSignup = void 0;
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
            message: "invalid input",
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
    console.log("Login Validation Middleware:", user);
    const LoginSchema = zod_1.z.object({
        email: zod_1.z.email('Invalid email address'),
        password: zod_1.z.string().trim().min(6, 'Password must be at least 6 characters long'),
    });
    const result = await LoginSchema.safeParseAsync(user);
    if (!result.success) {
        console.log(result.error);
        const formattedErrors = zod_1.z.flattenError(result.error).fieldErrors;
        res.status(400).json({
            success: false,
            message: "invalid input",
            errors: formattedErrors,
        });
    }
    else {
        next();
    }
});
// Product Addition Validation Schema
exports.ValidateProductAddition = (0, utils_1.asyncHandler)(async (req, res, next) => {
    const product = req.body;
    const ProductSchema = zod_1.z.object({
        name: zod_1.z.string().trim().min(3, 'Product name must be at least 3 characters long'),
        description: zod_1.z.string().trim().min(10, 'Description must be at least 10 characters long'),
        price: zod_1.z.string().trim().min(1, 'Price must be at least 1 character long'),
        // Accept both string (comma-separated) and array
        category: zod_1.z.union([
            zod_1.z.string().trim().min(1, 'Category must be at least 1 character long'),
            zod_1.z.array(zod_1.z.string().trim().min(1, 'Each category must be at least 1 character long'))
        ]),
        sizes: zod_1.z.union([
            zod_1.z.string().trim().min(1, "Size must be at least 1 character long"),
            zod_1.z.array(zod_1.z.string().trim().min(1, "Each size must be at least 1 character long"))
        ]),
        discount: zod_1.z.string().trim().optional(),
    });
    const result = await ProductSchema.safeParseAsync(product);
    if (!result.success) {
        console.log(result.error);
        const formattedErrors = zod_1.z.flattenError(result.error).fieldErrors;
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: formattedErrors,
        });
    }
    else {
        next();
    }
});
