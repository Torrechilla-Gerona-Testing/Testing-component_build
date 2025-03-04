import express, { Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();



router.get("/", async (req,res) =>{
    const data = [
        {id :1, Name:"John Patrick", role: "manager", salary: 123 }, 
        {id :2, Name:"Clyde", role: "trisikad Driver", salary: 2000000 },
        {id :3, Name:"Sid", role: "Product owner", salary: 50 },
        {id :4, Name:"Ryan", role: "Ambassador", salary: 123 },
        {id :5, Name:"Prince", role: "Fullstack", salary: 123 }]
        
    
    // try{
    //     // const employee = await prisma.employee.findMany()
    //     res.json(data)
    // }catch (error) {
    //     console.error("Error fetching posts:", error);
    //     res.status(500).json({ error: "Error fetching posts" });
    //   } finally {
    //     // await prisma.$disconnect(); 
    //   }
    res.json(data)
});

export default router