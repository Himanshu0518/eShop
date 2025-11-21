import {Router} from 'express';
import {SignupUser, LoginUser , GetCurrentUser,LogoutUser} from '../controllers/user.controller';
import {VaildateSignup, VaildateLogin } from '../middlewares/Validation';
import { VerifyJWT } from '../middlewares/authMiddleware';

const router = Router();

// User Signup Route
router.post('/signup', VaildateSignup, SignupUser);

// User Login Route
router.post('/login', VaildateLogin, LoginUser);

// Get Current User Route
router.get('/current-user', VerifyJWT, GetCurrentUser);

// User Logout Route
router.get('/logout', VerifyJWT,LogoutUser)

export default router;