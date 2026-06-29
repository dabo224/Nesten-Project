import { PrismaClient } from '@prisma/client';

// Singleton : une seule instance Prisma partagée par tous les modules (DIP)
const prisma = new PrismaClient();

export default prisma;
