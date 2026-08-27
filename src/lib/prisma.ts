/**
 * @file src/lib/prisma.ts
 * @description Safe PrismaClient stub with global cache.
 */

let prismaClient: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = global as unknown as { prisma: any };
  prismaClient = globalForPrisma.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient;
  }
} catch {
  prismaClient = null;
}

export const prisma = prismaClient;
