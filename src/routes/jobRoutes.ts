import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authorize } from '../middleware/auth';
import { JobSchema, JobSearchSchema } from '../schemas/job';
import { createJob, getJobs, getJob, updateJob, deleteJob } from '../controllers/jobController';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/', authenticate, authorize(UserRole.COMPANY), validateRequest(JobSchema), createJob);
router.get('/', validateRequest(JobSearchSchema), getJobs);
router.get('/:id', getJob);
router.put('/:id', authenticate, authorize(UserRole.COMPANY), validateRequest(JobSchema), updateJob);
router.delete('/:id', authenticate, authorize(UserRole.COMPANY), deleteJob);

export default router;

