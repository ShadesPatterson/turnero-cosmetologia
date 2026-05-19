import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const contentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  order: z.number().int().default(0),
})

export async function GET() {
  try {
    const content = await prisma.content.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(content)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = contentSchema.parse(body)

    const content = await prisma.content.create({
      data: validated,
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
