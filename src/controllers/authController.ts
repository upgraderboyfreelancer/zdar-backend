import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../middleware/errorHandler';
import { signJwt } from '../lib/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/email';
import { UserRole } from '@prisma/client';
import db from '../lib/db';
import { getVerificationTokenByEmail } from '../utils/verificationToken';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, userType, name, websiteUrl, logoUrl, firstName, lastName } = req.body;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the associated role-specific fields
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: userType,
        [userType === "USER" ? "candidate" : "company"]: {
          create: {
            ...(userType === "USER"
              ? {
                  firstName,
                  lastName,
                }
              : {
                  companyName: name,
                  websiteUrl,
                  logo: logoUrl,
                }),
          },
        },
      },
    });

    const verificationToken = signJwt(user.id, user.role, user.email);

    await db.verificationToken.create({
      data: {
        email: user.email,
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password)
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.emailVerified) {
      const existingToken = await getVerificationTokenByEmail(email);

      if (existingToken) {
        await db.verificationToken.delete({
          where: {
            id: existingToken.id
          }
        })
      }
      const verificationToken = signJwt(user.id, user.role, user.email);
      await db.verificationToken.create({
        data: {
          email: user.email,
          token: verificationToken,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });
      throw new AppError('Email not verified. Please check your email for the verification link.', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = signJwt(user.id, user.role, user.email);
    // console.log(token)
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, profileCompleted: user.profileCompleted } });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.params)
  try {
    const { token } = req.params;

    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await db.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({ where: { token } });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal that the user doesn't exist
      throw new AppError('If an account with that email exists, we have sent a password reset link.', 400);
    }

    const resetToken = signJwt(user.id, user.role, user.email);

    await db.passwordResetToken.create({
      data: {
        email: user.email,
        token: resetToken,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: 'If an account with that email exists, we have sent a password reset link.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({ where: { token } });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

