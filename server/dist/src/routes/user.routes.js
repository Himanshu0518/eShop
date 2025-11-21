"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const Validation_1 = require("../middlewares/Validation");
const router = (0, express_1.Router)();
// User Signup Route
router.post('/signup', Validation_1.VaildateSignup, user_controller_1.SignupUser);
// User Login Route
router.post('/login', Validation_1.VaildateLogin, user_controller_1.LoginUser);
