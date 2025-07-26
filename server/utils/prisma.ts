import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client with explicit error handling
let prismaInstance: PrismaClient | undefined

try {
  // Create a new PrismaClient instance with explicit options
  prismaInstance = new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
  })

  console.log('Prisma Client initialized successfully')
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error)
  throw error
}

// Export the initialized Prisma Client instance
export const prisma = prismaInstance
