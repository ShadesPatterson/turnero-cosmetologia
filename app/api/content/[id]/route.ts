/**
 * Endpoint: /api/content/[id]
 * 
 * Maneja operaciones individuales de contenido
 * - PUT: Edita un contenido específico
 * - DELETE: Elimina un contenido específico
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/content/[id]
 * Edita un contenido por su ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, imageUrl, videoUrl, order } = body

    const content = await prisma.content.findUnique({
      where: { id },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        title: title || content.title,
        description: description || content.description,
        imageUrl: imageUrl !== undefined ? imageUrl : content.imageUrl,
        videoUrl: videoUrl !== undefined ? videoUrl : content.videoUrl,
        order: order !== undefined ? order : content.order,
      },
    })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/content/[id]
 * Elimina un contenido por su ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Desempaquetar el ID del parámetro (es una Promise en Next.js 15+)
    const { id: idParam } = await params
    const id = parseInt(idParam)

    // Validar que el ID sea un número válido
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // Verificar que el contenido exista antes de eliminarlo
    const content = await prisma.content.findUnique({
      where: { id },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Eliminar el contenido
    await prisma.content.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Content deleted' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
