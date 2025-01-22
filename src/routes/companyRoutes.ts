import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authorize } from '../middleware/auth';
import { UpdateApplicantStatusSchema } from '../schemas/company';
import { getCompanies, getCompany, getCompanyApplicants, updateApplicantStatus } from '../controllers/companyController';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompany);
router.get('/:id/applicants', authenticate, authorize(UserRole.COMPANY), getCompanyApplicants);
router.put('/:companyId/jobs/:jobId/applicants/:applicantId', authenticate, authorize(UserRole.COMPANY), validateRequest(UpdateApplicantStatusSchema), updateApplicantStatus);

export default router;

