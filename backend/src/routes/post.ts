import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


router.get("/viewpost", async (req, res) => {
  try {
    const posts = await prisma.post.findMany(); 
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  } finally {
    await prisma.$disconnect(); 
  }
});

router.post("/addpost", async (req, res) => {
  const { title, content } = req.body; 
  try {
    const post = await prisma.post.create({ 
      data: {
        title,
        content,
      },
    });
    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  } finally {
    await prisma.$disconnect(); 
  }
});

router.delete("/deletepost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.delete({ 
      where: { id: id },
    });
    res.json(post);
  } catch (error) {
    console.error("Error deleting post:", error);
    if ((error as any).code === "P2025") {
      // Prisma error code for "Record to delete does not exist"
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(500).json({ error: "Error deleting post", details: (error as any).message });
    }
  } finally {
    await prisma.$disconnect(); 
  }
});

export default router; 