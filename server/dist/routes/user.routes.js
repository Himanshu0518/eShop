"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const Validation_1 = require("../middlewares/Validation");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// User Signup Route
router.post('/signup', Validation_1.VaildateSignup, user_controller_1.SignupUser);
// User Login Route
router.post('/login', Validation_1.VaildateLogin, user_controller_1.LoginUser);
// Get Current User Route
router.get('/current-user', authMiddleware_1.VerifyJWT, user_controller_1.GetCurrentUser);
// User Logout Route
router.get('/logout', authMiddleware_1.VerifyJWT, user_controller_1.LogoutUser);
exports.default = router;
