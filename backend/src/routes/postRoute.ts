import express, { Request, Response } from "express"; // Ensure Request and Response are imported from express
import { PrismaClient, Prisma } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/viewpost", async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {

    res.status(500).json({ error: "Error fetching posts" });
  } finally {
    await prisma.$disconnect();
  }
});

router.post("/addpost", async (req: Request, res: Response) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    res.status(404).json({ error: 'Title and content are required' });
  }

  try {
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
      },
    });
    res.json(post);
  } catch (error) {
   
    res.status(500).json({ error: "Error creating post" });
  } finally {
    await prisma.$disconnect();
  }
});

router.delete("/deletepost/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
   res.status(404).json({ error: 'Invalid ID format' }); 
  }

  try {
    await prisma.post.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
   
      res.status(404).json({ error: "Post not found" }); 
    }


    res.status(500).json({ error: "Error deleting post" });
  } finally {
    await prisma.$disconnect();
  }
});

router.put("/editpost/:id", async (req: Request, res: Response) => { 
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatePost = await prisma.post.update({
      where: { id },
      data: { title, content },
    });
    res.status(200).json(updatePost);
  } catch (error) {

    res.status(500).json({ error: "Error updating post" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;