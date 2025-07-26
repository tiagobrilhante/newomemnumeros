import { PrismaClient } from '@prisma/client'

// Create a new PrismaClient instance directly
const prisma = new PrismaClient({
  log: ['error'],
})

export default prisma
