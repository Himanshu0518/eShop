import {z} from 'zod';
import {Request, Response, NextFunction} from 'express';
import {asyncHandler} from '../utils/utils';

// User Signup Validation Schema

export const VaildateSignup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;

    const SignupSchema = z.object({
        name: z.string().trim().min(3, 'Name must be at least 3 characters long'),
        email: z.email('Invalid email address'),
        password: z.string().trim().min(6, 'Password must be at least 6 characters long'),
        confirmPassword: z.string().trim().min(6, 'Password must be at least 6 characters long'),
        img: z.string().trim().optional(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
   
    const result = await SignupSchema.safeParseAsync(user);
    if (!result.success) {
        const formattedErrors = z.flattenError(result.error).fieldErrors;
        res.status(400).json({
            success: false,
            message: "invalid input",
            errors: formattedErrors,
        });
    } else {
        next();
    }

});

// User Login Validation Schema

export const VaildateLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    console.log("Login Validation Middleware:", user);
    const LoginSchema = z.object({
        email: z.email('Invalid email address'),
        password: z.string().trim().min(6, 'Password must be at least 6 characters long'),
    });
    const result = await LoginSchema.safeParseAsync(user);

    if (!result.success) {
        console.log(result.error);
        const formattedErrors = z.flattenError(result.error).fieldErrors;   
        res.status(400).json({
            success: false,
            message: "invalid input",
            errors: formattedErrors,
        });
    } else {
        next();
    }
});