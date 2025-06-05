import { PrismaClient } from '@prisma/client';

// Global prisma instance to prevent multiple connections in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database connection helper
export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');
    return prisma;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

// Graceful shutdown
export async function disconnectFromDatabase() {
  await prisma.$disconnect();
}
