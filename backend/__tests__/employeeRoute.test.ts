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
  jest.setTimeout(30000);
  beforeAll(async () => {
    try {
      await testPrisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error("Failed to connect to DB:", error);
      throw error;
    }
  },10000);

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
        error: "Internal server error creating employee",
      });
    });

    it('should return 400 for a missing field', async () => {
      const invalidPayload = {
        FirstName: null,
        LastName: "Doe",
        groupName: "Engineering",
        role: "Developer",
        expectedSalary: 20029,
        expectedDateOfDefense: new Date("2024-12-31") 
      };
  
      const response = await request(app)
        .post('/employees/add')
        .send(invalidPayload)
        .expect(400);
  
      expect(response.body).toMatchObject({
        error: "Error creating employee" ,
      });
    });
  });

  describe("GET /employees", () => {
    it("should return all employees", async () => {
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

      const response = await request(app).get("/employees").expect(200)

      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(2)

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
      const response = await request(app).get("/employees").expect(200)

      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(0)
    })
  })

  describe("DELETE /employees/delete/:id", () => {
    it("should delete an employee by ID", async () => {
      const employee = await createTestEmployee({
        FirstName: "Test",
        LastName: "Delete",
        groupName: "QA",
        role: "Tester",
        expectedSalary: 70000,
      });
      

      const deleteResponse = await request(app)
        .delete(`/employees/delete/${employee.id}`)
        .expect(204);

      expect(deleteResponse.body).toEqual({});

      const checkEmployee = await testPrisma.employee.findUnique({
        where: { id: employee.id },
      });
      
      expect(checkEmployee).toBeNull();
    });

    it('should return 404 when employee does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'; // Random UUID
      const response = await request(app)
        .delete(`/employees/delete/${nonExistentId}`)
        .expect(404);
  
      expect(response.body).toEqual({
        error: 'Employee not found',
      });
    });
  
    it('should return 400 when ID is empty', async () => {
      const response = await request(app)
        .delete('/employees/delete/ ') // Space as ID
        .expect(400);
  
      expect(response.body).toEqual({
        error: 'Employee ID is required',
      });
    });
  
    it('should return 404 when ID is missing', async () => {
      const response = await request(app)
        .delete('/employees/delete') // No ID provided
        .expect(404);
  
      expect(response.body).toEqual({
        error: 'Employee ID is required',
      });
    });

    
  });

  

describe("PUT /employees/update/:id", () => {
  it("should update an employee by ID", async () => {
    // Create a test employee to update
    const employee = await createTestEmployee({
      FirstName: "Test",
      LastName: "Update",
      groupName: "QA",
      role: "Tester",
      expectedSalary: 70000,
    });

    // Updated data
    const updatedData = {
      FirstName: "Updated",
      LastName: "Employee",
      groupName: "Development",
      role: "Senior Tester",
      expectedSalary: 85000,
      expectedDateOfDefense: new Date("2025-06-30"),
    };

    // Make update request
    const updateResponse = await request(app)
      .put(`/employees/update/${employee.id}`)
      .send(updatedData)
      .expect(200);

    // Verify the response contains updated data
    expect(updateResponse.body).toMatchObject({
      id: employee.id,
      FirstName: "Updated",
      LastName: "Employee",
      groupName: "Development",
      role: "Senior Tester",
      expectedSalary: 85000,
    });

    // Verify the employee was actually updated in the database
    const updatedEmployee = await testPrisma.employee.findUnique({
      where: { id: employee.id },
    });
    
    expect(updatedEmployee).not.toBeNull();
    expect(updatedEmployee).toMatchObject({
      FirstName: "Updated",
      LastName: "Employee",
      groupName: "Development",
      role: "Senior Tester",
    });
  });

  it("should return 400 when missing required fields", async () => {
    // Create a test employee to update
    const employee = await createTestEmployee({
      FirstName: "Test",
      LastName: "Missing",
      groupName: "QA",
      role: "Tester",
      expectedSalary: 70000,
    });

    // Payload with missing fields
    const invalidPayload = {
      FirstName: "Updated",
      // LastName is missing
      groupName: "Development",
      role: "Senior Tester",
      expectedSalary: 85000,
      expectedDateOfDefense: new Date("2025-06-30"),
    };

    // Make update request with invalid data
    const response = await request(app)
      .put(`/employees/update/${employee.id}`)
      .send(invalidPayload)
      .expect(400);

    // Verify error response
    expect(response.body).toMatchObject({
      error: "All fields are required for update",
    });

    // Verify the employee was NOT updated in the database
    const checkEmployee = await testPrisma.employee.findUnique({
      where: { id: employee.id },
    });
    
    expect(checkEmployee).not.toBeNull();
    expect(checkEmployee!.LastName).toBe("Missing"); // Should still have original value
  });

  it("should return 500 when trying to update non-existent employee", async () => {
    // Use a non-existent ID
    const nonExistentId = "non-existent-id";

    const updateData = {
      FirstName: "Updated",
      LastName: "NonExistent",
      groupName: "Development",
      role: "Senior Tester",
      expectedSalary: 85000,
      expectedDateOfDefense: new Date("2025-06-30"),
    };

    // Make update request with non-existent ID
    const response = await request(app)
      .put(`/employees/update/${nonExistentId}`)
      .send(updateData)
      .expect(500);

    // Verify error response
    expect(response.body).toHaveProperty("error", "Employee not found");
  });
});
});