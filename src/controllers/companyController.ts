import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../middleware/errorHandler';
import db from '../lib/db';

export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await db.company.findMany();
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const company = await db.company.findUnique({
      where: { id },
      include: { jobs: true },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const getCompanyApplicants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;

    if (id !== userId) {
      throw new AppError('Unauthorized to view applicants for this company', 403);
    }

    const applicants = await db.applicant.findMany({
      where: {
        job: {
          companyId: id,
        },
      },
      include: {
        candidate: true,
        job: true,
      },
    });

    res.json(applicants);
  } catch (error) {
    next(error);
  }
};

export const updateApplicantStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, jobId, applicantId } = req.params;
    const { userId } = req.user!;
    const { status } = req.body;

    if (companyId !== userId) {
      throw new AppError('Unauthorized to update applicant status for this company', 403);
    }

    const applicant = await db.applicant.findFirst({
      where: {
        id: parseInt(applicantId),
        job: {
          id: parseInt(jobId),
          companyId: companyId,
        },
      },
    });

    if (!applicant) {
      throw new AppError('Applicant not found', 404);
    }

    const updatedApplicant = await db.applicant.update({
      where: { id: parseInt(applicantId) },
      data: { status },
    });

    res.json(updatedApplicant);
  } catch (error) {
    next(error);
  }
};

