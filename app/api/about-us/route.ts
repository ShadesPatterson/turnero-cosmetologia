import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const aboutUsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
})

export async function GET() {
  try {
    let aboutUs = await prisma.aboutUs.findFirst()
    if (!aboutUs) {
      // Create default if doesn't exist
      aboutUs = await prisma.aboutUs.create({
        data: {
          title: 'Sobre Nosotros',
          description: 'Descripción de la empresa',
        },
      })
    }
    return NextResponse.json(aboutUs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch about us' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = aboutUsSchema.parse(body)

    let aboutUs = await prisma.aboutUs.findFirst()

    if (!aboutUs) {
      aboutUs = await prisma.aboutUs.create({
        data: validated,
      })
    } else {
      aboutUs = await prisma.aboutUs.update({
        where: { id: aboutUs.id },
        data: validated,
      })
    }

    return NextResponse.json(aboutUs)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to update about us' }, { status: 500 })
  }
}
