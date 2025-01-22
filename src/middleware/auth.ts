import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { PrismaClient, UserRole } from '@prisma/client';
const secret = process.env.JWT_SECRET! || "1234"
const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.headers)
    const token = req.headers.authorization?.split(' ')[1];
    // console.log(token)
    console.log(token)
    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log(`token data => ${decoded}, ${secret}`)

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    console.log(`user => ${JSON.stringify(user)}`)
    if (!user) {
      throw new AppError('User not found', 404);
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error)
    next(new AppError('Invalid token', 401));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Unauthorized', 403));
    }

    next();
  };
};

