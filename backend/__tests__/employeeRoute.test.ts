import request from 'supertest';
import express from 'express';
import employeeRouter from '../src/routes/employeeRoute';
import { PrismaClient } from '@prisma/client';
import { employeePayload } from './fakeData';
import { resetDB, createTestEmployee } from '../tests/testUtils';
import { describe, expect, it, beforeAll, beforeEach, afterAll } from "@jest/globals"

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
    try {
      await testPrisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error("Failed to connect to DB:", error);
      throw error;
    }
  },30000);

  beforeEach(async () => {
    await testPrisma.$disconnect();
    await testPrisma.$connect();
    await resetDB();
  });

  afterAll(async () => {
    await testPrisma.$queryRaw`DISCARD ALL`;
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

    it('should return 500 for invalid salary (non-number)', async () => {
      const invalidPayload = {
        FirstName: "John",
        LastName: "Doe",
        groupName: "Engineering",
        role: "Developer",
        expectedSalary: "STRING(INVALID)",
        expectedDateOfDefense: new Date("2024-12-31") 
      };
  
      const response = await request(app)
        .post('/employees/add')
        .send(invalidPayload)
        .expect(500);
  
      expect(response.body).toMatchObject({
        error: "Error creating employee",
      });
    });
  });

  describe("GET /employees", () => {
    it("should return all employees", async () => {
      // Create test employees
      const employee1 = await createTestEmployee({
        FirstName: "Jane",
        LastName: "Smith",
        groupName: "Design",
        role: "UI Designer",
        expectedSalary: 75000,
      })

      const employee2 = await createTestEmployee({
        FirstName: "Bob",
        LastName: "Johnson",
        groupName: "Marketing",
        role: "Content Strategist",
        expectedSalary: 65000,
      })

      // Make request to the endpoint
      const response = await request(app).get("/employees").expect(200)

      // Verify response
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(2)

      // Check if the returned employees match the created ones
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: employee1.id,
            FirstName: "Jane",
            LastName: "Smith",
            groupName: "Design",
            role: "UI Designer",
          }),
          expect.objectContaining({
            id: employee2.id,
            FirstName: "Bob",
            LastName: "Johnson",
            groupName: "Marketing",
            role: "Content Strategist",
          }),
        ]),
      )
    })

    it("should return an empty array when no employees exist", async () => {
      // Make request to the endpoint
      const response = await request(app).get("/employees").expect(200)

      // Verify response is an empty array
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(0)
    })
  })

  describe("DELETE /employees/delete/:id", () => {
  it("should delete an employee by ID", async () => {
    // Create a test employee to delete
    const employee = await createTestEmployee({
      FirstName: "Test",
      LastName: "Delete",
      groupName: "QA",
      role: "Tester",
      expectedSalary: 70000,
    });

    // Make delete request
    const deleteResponse = await request(app)
      .delete(`/employees/delete/${employee.id}`)
      .expect(204);

    // Verify the response is empty (204 No Content)
    expect(deleteResponse.body).toEqual({});

    // Verify the employee no longer exists in the database
    const checkEmployee = await testPrisma.employee.findUnique({
      where: { id: employee.id },
    });
    
    expect(checkEmployee).toBeNull();
  });

  it("should return 500 when trying to delete non-existent employee", async () => {
    // Use a non-existent ID
    const nonExistentId = "non-existent-id";

    // Make delete request with non-existent ID
    const response = await request(app)
      .delete(`/employees/delete/${nonExistentId}`)
      .expect(500);

    // Verify error response
    expect(response.body).toHaveProperty("error", "Error deleting employee");
  });
});
});