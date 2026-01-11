import {Router} from 'express';
import {SignupUser, LoginUser , GetCurrentUser,LogoutUser,getAllUsers} from '../controllers/user.controller';
import {VaildateSignup, VaildateLogin } from '../middlewares/Validation';
import { VerifyJWT, VerifyAdmin } from '../middlewares/authMiddleware';

const router = Router();

// User Signup Route
router.route('/signup').post(VaildateSignup, SignupUser);

// User Login Route
router.route('/login').post(VaildateLogin, LoginUser);

// Get Current User Route
router.route('/current-user').get(VerifyJWT,GetCurrentUser);

// User Logout Route
router.route('/logout').get(VerifyJWT,LogoutUser);

// for admin get all users 
router.route('/getAll').get(VerifyJWT,VerifyAdmin,getAllUsers);

export default router;