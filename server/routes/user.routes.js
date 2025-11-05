import express from 'express';
import {  
    login, 
    register , 
    logout,
    sendVerificationEmailOtp,
    verifyEmailOtp,
    isAuthenticated,
    sendResetPasswordOtp,
    resetPassword
} from '../controller/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-otp", authMiddleware, sendVerificationEmailOtp);
router.post("/verify-otp",authMiddleware ,verifyEmailOtp);
router.post("/is-authenticated", authMiddleware, isAuthenticated);
router.post("/send-reset-password-otp", sendResetPasswordOtp);
router.post("/reset-password", resetPassword);

export default router;