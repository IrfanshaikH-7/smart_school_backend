import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { ApiError, UnauthorizedError, ForbiddenError } from './error';
import { config } from '../config';
import prisma from '../prisma/client';
import { AuthRequest } from '../types/express.d';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, config.jwtSecret); // decoded is JwtPayload

    // Fetch the full user object from the database, including roles
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Assign the full user object to req.user
    req.user = user; // Now req.user should have the correct type due to express.d.ts

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const authorize = (requiredRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      // Fetch user with roles from DB to ensure up-to-date roles
      const userWithRoles = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!userWithRoles) {
        throw new UnauthorizedError('User not found');
      }

      const userRoles = userWithRoles.userRoles.map(ur => ur.role.name);

      const hasPermission = requiredRoles.some(role => userRoles.includes(role));

      if (!hasPermission) {
        throw new ForbiddenError('Access denied: Insufficient permissions');
      }

      // Update req.user with full user object including roles
      req.user = userWithRoles;

      next();
    } catch (error) {
      next(error);
    }
  };
};