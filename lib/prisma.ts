import * as PrismaPkg from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db'

// Only use the Better SQLite3 adapter when using a file-based SQLite URL.
// In production you should use a remote DB or Prisma Data Proxy and not pass an adapter.
const isSqliteFile = databaseUrl.startsWith('file:')
const globalForPrisma = globalThis as unknown as { prisma: any | undefined }

const PrismaClient = (PrismaPkg as any).PrismaClient as new (options?: any) => any

export const prisma: any =
  globalForPrisma.prisma ??
  (() => {
    const options: any = {}
    if (isSqliteFile) {
      options.adapter = new PrismaBetterSqlite3({ url: databaseUrl })
    }

    const client = new PrismaClient(options)
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
    return client
  })()