import { Request } from 'express';
import { User as PrismaUser, Role as PrismaRole, UserRole as PrismaUserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser & { userRoles: (PrismaUserRole & { role: PrismaRole })[] };
    }
  }
}

export interface AuthRequest extends Request {
  user?: PrismaUser & { userRoles: (PrismaUserRole & { role: PrismaRole })[] };
}