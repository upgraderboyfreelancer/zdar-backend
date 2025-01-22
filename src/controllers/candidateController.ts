import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../middleware/errorHandler';
import db from '../lib/db';

export const getCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidates = await db.candidate.findMany();
    res.json(candidates);
  } catch (error) {
    next(error);
  }
};

export const getCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const candidate = await db.candidate.findUnique({
      where: { id },
      include: { applicants: true },
    });

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    res.json(candidate);
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { jobId } = req.body;

    if (!userId) {
      throw new AppError('Candidate profile not found', 404);
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    const existingApplication = await db.applicant.findFirst({
      where: {
        candidateId: userId,
        jobId,
      },
    });

    if (existingApplication) {
      throw new AppError('You have already applied for this job', 400);
    }

    const application = await db.applicant.create({
      data: {
        candidate: { connect: { id: userId } },
        job: { connect: { id: jobId } },
      },
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const withdrawApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { jobId } = req.params;

    if (!userId) {
      throw new AppError('Candidate profile not found', 404);
    }

    const application = await db.applicant.findFirst({
      where: {
        candidateId: userId,
        jobId: parseInt(jobId),
      },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    await db.applicant.delete({
      where: { id: application.id },
    });

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    next(error);
  }
};

