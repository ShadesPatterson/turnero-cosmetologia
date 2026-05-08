import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  let services = await prisma.service.findMany()
  if (services.length === 0) {
    // Seed services
    services = await Promise.all([
      prisma.service.create({ data: { name: 'Lifting facial', duration: 60 } }),
      prisma.service.create({ data: { name: 'Pestañas coreanas', duration: 60 } }),
      prisma.service.create({ data: { name: 'Depilación definitiva', duration: 60 } }),
      prisma.service.create({ data: { name: 'Masajes descontracturantes', duration: 60 } }),
    ])
  }
  return NextResponse.json(services)
}