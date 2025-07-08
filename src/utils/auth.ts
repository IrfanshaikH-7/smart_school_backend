import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, Role } from '@prisma/client';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  schoolId: string;
}

export const generateAccessToken = (user: User & { userRoles: { role: Role }[] }): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    roles: user.userRoles.map(ur => ur.role.name),
    schoolId: user.schoolId,
  };
  return jwt.sign(payload, config.jwtSecret as jwt.Secret, { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
};

export const generateRefreshToken = (user: User & { userRoles: { role: Role }[] }): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    roles: user.userRoles.map(ur => ur.role.name),
    schoolId: user.schoolId,
  };
  return jwt.sign(payload, config.jwtRefreshSecret as jwt.Secret, { expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};