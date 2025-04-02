import { Prisma } from '@prisma/client';

// Use the correct type from Prisma
type EmployeeCreateInput = Prisma.EmployeeCreateInput;

// Make all fields required and match Prisma's exact types
export interface TestEmployeeData extends Omit<EmployeeCreateInput, 'id'> {
  FirstName: string;
  LastName: string;
  groupName: string;
  role: string;
  expectedSalary: number;
  expectedDateOfDefense: Date | string;
}