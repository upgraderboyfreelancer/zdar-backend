import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../middleware/errorHandler';
import { UserRole } from '@prisma/client';
import db from '../lib/db';

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role, email } = req.user!;
    const profileData = req.body;

    if (!userId) {
      throw new AppError('Profile not found', 404);
    }

    let updatedUser;

    if (role === UserRole.USER) {
      updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          candidate: {
            update: {
              where: { id: userId },
              data: profileData,
            },
          },
          profileCompleted: true,
        },
        include: { candidate: true },
      });
    } else if (role === UserRole.COMPANY) {
      updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          company: {
            update: {
              where: { id: userId },
              data: profileData,
            },
          },
          profileCompleted: true,
        },
        include: { company: true },
      });
    } else {
      throw new AppError('Invalid user role', 400);
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.user)
    const { userId, role } = req.user!;
    console.log(userId)
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        candidate: role === UserRole.USER,
        company: role === UserRole.COMPANY,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getProfileState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        candidate: role === UserRole.USER,
        company: role === UserRole.COMPANY,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({profileCompleted: user.profileCompleted});
  } catch (error) {
    next(error);
  }
};