import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: databaseUrl })
const globalForPrisma = globalThis as unknown as { prisma: any | undefined }

export const prisma: any =
  globalForPrisma.prisma ??
  (() => {
    const client = new PrismaClient({ adapter })
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
    return client
  })()