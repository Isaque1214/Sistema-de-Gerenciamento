// Este arquivo garante que o Next.js não abra milhares de conexões com o SQLite
// enquanto você estiver desenvolvendo, o que causaria o erro "Database is Locked".

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma