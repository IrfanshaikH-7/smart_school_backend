import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding...');

  const dummyContentPath = path.join(__dirname, '../../dummy_content');

  // Helper function to read JSON files
  const readJsonFile = <T>(filename: string): T[] => {
    const filePath = path.join(dummyContentPath, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  };

  // Read dummy data
  const schoolsData = readJsonFile<any>('schools.json');
  const usersData = readJsonFile<any>('users.json');
  const rolesData = readJsonFile<any>('roles.json');
  const userRolesData = readJsonFile<any>('user_roles.json');
  const classesData = readJsonFile<any>('classes.json');
  const studentsData = readJsonFile<any>('students.json');
  const studentParentsData = readJsonFile<any>('student_parents.json');
  const subjectsData = readJsonFile<any>('subjects.json');
  const teacherAssignedToSubjectsData = readJsonFile<any>('teacher_assigned_to_subjects.json');

  // Seed Schools
  for (const school of schoolsData) {
    await prisma.school.upsert({
      where: { id: school.id },
      update: {},
      create: school,
    });
    logger.info(`Seeded School: ${school.name}`);
  }

  // Seed Roles
  for (const role of rolesData) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
    logger.info(`Seeded Role: ${role.name}`);
  }

  // Seed Users (with password hashing)
  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        phone: user.phone,
        schoolId: user.schoolId,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        phone: user.phone,
        schoolId: user.schoolId,
      },
    });
    logger.info(`Seeded User: ${user.email}`);
  }

  // Seed UserRoles
  for (const userRole of userRolesData) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: userRole.userId, roleId: userRole.roleId } },
      update: {},
      create: userRole,
    });
    logger.info(`Seeded UserRole: User ${userRole.userId} - Role ${userRole.roleId}`);
  }

  // Seed Classes
  for (const classData of classesData) {
    await prisma.class.upsert({
      where: { id: classData.id },
      update: {},
      create: classData,
    });
    logger.info(`Seeded Class: ${classData.name} ${classData.section}`);
  }

  // Seed Subjects
  for (const subject of subjectsData) {
    await prisma.subject.upsert({
      where: { id: subject.id },
      update: {},
      create: subject,
    });
    logger.info(`Seeded Subject: ${subject.name}`);
  }

  // Seed Students
  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: {},
      create: student,
    });
    logger.info(`Seeded Student: ${student.name}`);
  }

  // Seed StudentParents
  for (const studentParent of studentParentsData) {
    await prisma.studentParent.upsert({
      where: { studentId_parentUserId: { studentId: studentParent.studentId, parentUserId: studentParent.parentUserId } },
      update: {},
      create: studentParent,
    });
    logger.info(`Seeded StudentParent: Student ${studentParent.studentId} - Parent ${studentParent.parentUserId}`);
  }

  // Seed TeacherAssignedToSubjects
  for (const tas of teacherAssignedToSubjectsData) {
    await prisma.teacherAssignedToSubject.upsert({
      where: { id: tas.id },
      update: {},
      create: tas,
    });
    logger.info(`Seeded TeacherAssignedToSubject: Teacher ${tas.teacherId} - Subject ${tas.subjectId} - Class ${tas.classId}`);
  }

  logger.info('Database seeding completed.');
}

main()
  .catch((e) => {
    logger.error('Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });