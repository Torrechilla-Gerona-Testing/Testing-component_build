import request from 'supertest';
import express from 'express';
import postRouter from '../src/routes/postRoute';
import { PrismaClient } from '@prisma/client';
import { postIncompletePayload } from './fakeData';

// Initialize test app
const app = express();
app.use(express.json());
app.use('/posts', postRouter);

// Test-specific Prisma client
const testPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

describe('Post API', () => {
  beforeAll(async () => {
    await testPrisma.$connect();
    await testPrisma.post.deleteMany(); // Clear posts before tests
  });
  describe('Post API - Additional Tests', () => {
    describe('POST /posts/addpost', () => {
      it('should return 404 when title is missing', async () => {
        const response = await request(app)
          .post('/posts/addpost')
          .send({ content: 'Content without a title' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', "Title and content are required");
      },1000);

    
    });

    describe('DELETE /posts/deletepost/:id', () => {
      
      it('should return 404 when trying to delete a post with invalid ID format', async () => {
        const response = await request(app).delete('/posts/deletepost/invalid-id');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Post not found');
      },10000);
    });

  
  });

  describe('POST /posts/addpost', () => {
    it('should create a post (Happy Path)', async () => {
      const response = await request(app)
        .post('/posts/addpost')
        .send({ title: 'Test Post', content: 'This is a test post.' });
      console.log('Response received:', response.body);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: 'Test Post',
        content: 'This is a test post.',
      });
    },10000);

    it('should fail to create a post with missing fields (Sad Path)', async () => {
      const response = await request(app)
        .post('/posts/addpost')
        .send({}); 

      expect(response.status).toBe(404); 
      expect(response.body).toHaveProperty('error', 'Title and content are required');
    });
  });

  describe('DELETE /posts/deletepost/:id', () => {
    it('should fail to delete a non-existent post (Sad Path)', async () => {
      const response = await request(app).delete('/posts/deletepost/f3322f'); // Non-existent ID

      expect(response.status).toBe(404); 
      expect(response.body).toHaveProperty('error', 'Post not found');
    },10000);
  });
});