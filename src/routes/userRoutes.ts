import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';
import { ProfileSchema } from '../schemas/user';
import { updateProfile, getProfile, getProfileState } from '../controllers/userController';

const router = express.Router();

router.put('/profile', authenticate, validateRequest(ProfileSchema), updateProfile);
router.get('/profile', authenticate, getProfile);
router.get('/profileCompleted', authenticate, getProfileState);
export default router;

