import request from 'supertest';
import express from 'express';
import employeeRouter from '../src/routes/employeeRoute';
import { PrismaClient } from '@prisma/client';
import { employeePayload } from './fakeData';
import { resetDB, createTestEmployee } from '../tests/testUtils';

// Initialize test app
const app = express();
app.use(express.json());
app.use('/employees', employeeRouter);

// Test-specific Prisma client
const testPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

describe('Employee API', () => {
  beforeAll(async () => {
    await testPrisma.$connect();
    await resetDB();
  },10000);

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  describe('POST /employees', () => {
    it('should create employee with test data', async () => {
      const response = await request(app)
        .post('/employees/add')
        .send(employeePayload); 
        
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        FirstName: "John",
        LastName: "Doe",
        groupName: "Engineering",
        role: "Developer",
        expectedSalary: 80000,
        expectedDateOfDefense: "2024-12-31T00:00:00.000Z"
      });
    });
  });
});