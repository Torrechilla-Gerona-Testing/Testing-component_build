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
        // comment out ko lng kay bsi isipon ga fail hehehe
        // console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Error fetching employees" });
    } finally {
        await prisma.$disconnect();
    }
});

// POST route to add a new employee
router.post("/add", async (req, res) => {
  const { FirstName, LastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;

  console.log("Received data:", req.body);

  if (!FirstName || !LastName || !groupName || !role || !expectedSalary || !expectedDateOfDefense) {
    res.status(400).json({ error: "Error creating employee" });
  } else {
    try {
        const newEmployee = await prisma.employee.create({
            data: {
                FirstName,
                LastName,
                groupName,
                role,
                expectedSalary: parseInt(expectedSalary), 
                expectedDateOfDefense: new Date(expectedDateOfDefense), 
            },
        });
        res.status(201).json(newEmployee);
    } catch (error) {
      //   console.error("Error creating employee:", error);
        res.status(500).json({ error: "Internal server error creating employee" });
    } finally {
        await prisma.$disconnect();
    }
  }
  
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    if (!id || id.trim() === "") {
        res.status(400).json({ error: "Employee ID is required" });
    } else {
        try {
            await prisma.employee.delete({
                where: { id }
            });
            res.status(204).send();
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                res.status(404).json({ error: "Employee not found" });
            } else {
                res.status(500).json({ error: "Error deleting employee" });
            }
        }
    }
});

router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;
    
    // Add validation for ID and required fields
    if (!id) {
        res.status(400).json({ error: "Employee ID is required" });
    } else if (!FirstName || !LastName || !groupName || !role || !expectedSalary || !expectedDateOfDefense) {
        res.status(400).json({ error: "All fields are required for update" });
    } else {
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
                    expectedSalary: parseFloat(expectedSalary), 
                    expectedDateOfDefense: new Date(expectedDateOfDefense), 
                },
            });
            res.status(200).json(updatedEmployee);
        } catch (error) {
            // comment out ko lng kay bsi isipon ga fail hehehe
            // console.error("Error updating employee:", error);
            
            res.status(500).json({ error: "Employee not found" });
        } finally {
            await prisma.$disconnect();
        }
    }
});

export default router;