/**
 * Endpoint: /api/content
 * 
 * Gestiona el contenido (imágenes y videos) de la galería
 * - GET: Obtiene todos los contenidos ordenados
 * - POST: Crea un nuevo contenido (uso desde admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para el contenido
const contentSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  imageUrl: z.string().optional(), // URL de imagen opcional
  videoUrl: z.string().optional(), // URL de video opcional
  order: z.number().int().default(0), // Orden de aparición
})

/**
 * GET /api/content
 * Obtiene todos los contenidos ordenados por el campo "order"
 * Retorna array de contenidos
 */
export async function GET() {
  try {
    const content = await prisma.content.findMany({
      orderBy: { order: 'asc' }, // Ordenar de menor a mayor
    })
    return NextResponse.json(content)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

/**
 * POST /api/content
 * Crea un nuevo contenido (imagen/video)
 * Requiere: title, description (obligatorios)
 * Opcional: imageUrl, videoUrl, order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validar que los datos cumplan con el esquema
    const validated = contentSchema.parse(body)

    // Crear el contenido en la base de datos
    const content = await prisma.content.create({
      data: validated,
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retornar errores de validación
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
