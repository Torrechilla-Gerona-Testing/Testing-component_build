import { PrismaClient } from '@prisma/client';

// Verify environment variable is loaded
if (!process.env.DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL is not defined in environment variables');
}

const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

export default testPrisma;