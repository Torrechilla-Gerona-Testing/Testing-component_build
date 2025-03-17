import express, { Router, Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const router: Router = express.Router();
const prisma = new PrismaClient();

// GET route to fetch all employees
router.get("/", async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Error fetching employees" });
    } finally {
        await prisma.$disconnect();
    }
});

// POST route to add a new employee
router.post("/add", async (req, res) => {
  const { FirstName, LastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;

  try {
      const newEmployee = await prisma.employee.create({
          data: {
              FirstName,
              LastName,
              groupName,
              role,
              expectedSalary: parseFloat(expectedSalary), // Convert to number
              expectedDateOfDefense: new Date(expectedDateOfDefense), // Convert to Date
          },
      });
      res.status(201).json(newEmployee);
  } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Error creating employee" });
  } finally {
      await prisma.$disconnect();
  }
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
        await prisma.employee.delete({
            where: {
                id
            },
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ error: "Error deleting employee" });
    } finally {
        await prisma.$disconnect();
    }
});

router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;
  
    try {
        const updatedEmployee = await prisma.employee.update({
            where: {
                id
            },
            data: {
                FirstName,
                LastName,
                groupName,
                role,
                expectedSalary: parseFloat(expectedSalary), // Convert to number
                expectedDateOfDefense: new Date(expectedDateOfDefense), // Convert to Date
            },
        });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ error: "Error updating employee" });
    } finally {
        await prisma.$disconnect();
    }
});

export default router;