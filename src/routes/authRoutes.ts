import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from "../schemas/auth"
import { register, login, verifyEmail, forgotPassword, resetPassword } from "../controllers/authController"

const router = express.Router();

router.post('/register', validateRequest(RegisterSchema), register);
router.post('/login', validateRequest(LoginSchema), login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', validateRequest(ForgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validateRequest(ResetPasswordSchema), resetPassword);

export default router;

