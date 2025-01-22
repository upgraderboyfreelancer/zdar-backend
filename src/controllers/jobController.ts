import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../middleware/errorHandler';
import { UserRole } from '@prisma/client';
import db from '../lib/db';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const jobData = req.body;

    if (!userId) {
      throw new AppError('Company profile not found', 404);
    }

    const job = await db.job.create({
      data: {
        ...jobData,
        company: { connect: { id: userId } },
      },
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, contractType, experience } = req.query;

    const jobs = await db.job.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { positionName: { contains: query as string, mode: 'insensitive' } },
              { jobOffer: { contains: query as string, mode: 'insensitive' } },
            ],
          } : {},
          contractType ? { contractType: contractType as string } : {},
          experience ? { experience: experience as string } : {},
        ],
      },
      include: { company: true },
    });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await db.job.findUnique({
      where: { id: parseInt(id) },
      include: { company: true },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const jobData = req.body;

    const job = await db.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.companyId !== userId) {
      throw new AppError('Unauthorized to update this job', 403);
    }

    const updatedJob = await db.job.update({
      where: { id: parseInt(id) },
      data: jobData,
    });

    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;

    const job = await db.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.companyId !== userId) {
      throw new AppError('Unauthorized to delete this job', 403);
    }

    await db.job.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

