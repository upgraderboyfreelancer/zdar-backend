import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authorize } from "../middleware/auth"
import { ApplyJobSchema } from '../schemas/candidate';
import { getCandidates, getCandidate, applyForJob, withdrawApplication } from '../controllers/candidateController';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', getCandidates);
router.get('/:id', getCandidate);
router.post('/apply', authenticate, authorize(UserRole.USER), validateRequest(ApplyJobSchema), applyForJob);
router.delete('/withdraw/:jobId', authenticate, authorize(UserRole.USER), withdrawApplication);

export default router;
