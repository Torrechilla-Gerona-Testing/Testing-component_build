import testPrisma from '../prisma/test-client';
import { TestEmployeeData } from '../tests/database.type';

export const resetDB = async () => {
  try {
    await testPrisma.$executeRaw`TRUNCATE TABLE "Employee" RESTART IDENTITY CASCADE`;
    await testPrisma.$executeRaw`TRUNCATE TABLE "Post" RESTART IDENTITY CASCADE`;
   
  } catch (error) {
    console.error('Database cleanup failed:', error);
    throw error;
  }
};

export const createTestEmployee = async (data: Partial<TestEmployeeData> = {}) => {
  // Provide required defaults and ensure proper typing
  const employeeData = {
    FirstName: data.FirstName || 'Test',
    LastName: data.LastName || 'User',
    groupName: data.groupName || 'Development',
    role: data.role || 'Developer',
    expectedSalary: data.expectedSalary || 50000,
    expectedDateOfDefense: data.expectedDateOfDefense 
      ? new Date(data.expectedDateOfDefense) 
      : new Date('2024-12-31')
  };

  return testPrisma.employee.create({
    data: employeeData
  });
};