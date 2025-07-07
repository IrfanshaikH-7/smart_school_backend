import prisma from '../prisma/client';
import { ApiError, NotFoundError, BadRequestError } from '../middlewares/error';
import { User, Prisma } from '@prisma/client'; // Import Prisma

// Example: Get all users
export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
};

// Example: Get user by ID
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

// Example: Create a new user (simplified, actual registration is in auth.service)
import { hashPassword } from '../utils/auth'; // Import hashPassword

export const createUser = async (data: { email: string; password: string; name: string; phone?: string; schoolId: string; roleName?: string }) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  let roleId: string | undefined;
  if (data.roleName) {
    const role = await prisma.role.findUnique({ where: { name: data.roleName } });
    if (!role) {
      throw new NotFoundError(`Role '${data.roleName}' not found`);
    }
    roleId = role.id;
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      schoolId: data.schoolId,
      userRoles: roleId ? { create: { roleId } } : undefined,
    } as Prisma.UserUncheckedCreateInput, // Cast to UncheckedCreateInput
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
  return newUser;
};

// Example: Update user
export const updateUser = async (id: string, data: { name?: string; phone?: string; schoolId?: string }) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone,
      schoolId: data.schoolId,
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
  return updatedUser;
};

// Example: Delete user
export const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new NotFoundError('User not found');
  }
  await prisma.user.delete({ where: { id } });
  return { message: 'User deleted successfully' };
};