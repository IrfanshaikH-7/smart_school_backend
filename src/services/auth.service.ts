import prisma from '../prisma/client';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyToken } from '../utils/auth';
import { ApiError, BadRequestError, UnauthorizedError } from '../middlewares/error';
import { config } from '../config'; // Import config
import { User, Prisma, Role as PrismaRole, UserRole as PrismaUserRole } from '@prisma/client';

type UserWithPasswordAndRoles = User & {
  password: string;
  userRoles: (PrismaUserRole & { role: PrismaRole })[];
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string | null
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  // Find the 'parent' role
  const parentRole = await prisma.role.findUnique({ where: { name: 'parent' } });
  if (!parentRole) {
    throw new ApiError(500, 'Parent role not found. Please ensure roles are seeded.');
  }

  // Find the default school
  const defaultSchool = await prisma.school.findUnique({ where: { name: 'Springfield Elementary' } });
  if (!defaultSchool) {
    throw new ApiError(500, 'Springfield Elementary not found. Please ensure schools are seeded.');
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      schoolId: defaultSchool.id, // Use the ID of the default school
      userRoles: {
        create: {
          roleId: parentRole.id,
        },
      },
    } as Prisma.UserUncheckedCreateInput,
    include: { // Include userRoles to get role data
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  // Exclude password from the returned user object (Prisma does not return it by default)
  // The newUser object will not contain the password field.
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = (await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  })) as UserWithPasswordAndRoles | null;

  if (!user || !(await comparePassword(password, (user as any).password))) { // Cast to any to access password
    throw new UnauthorizedError('Invalid credentials');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // In a stateless refresh token approach, we don't store the refresh token in DB.
  // It's sent to the client and its validity is checked by verification.

  const { password: _, ...userWithoutPassword } = user as any; // Cast to any for destructuring
  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const decoded = verifyToken(refreshToken, config.jwtRefreshSecret);
    // In a stateless refresh token, we just re-issue based on the decoded payload
    // No database lookup for the refresh token itself.
    // However, we should verify the user still exists and is active.
    const user = (await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    })) as UserWithPasswordAndRoles | null;

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token: User not found');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};