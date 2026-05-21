/**
 * Endpoint: /api/about-us
 * 
 * Gestiona la información de la empresa en la página "Sobre Nosotros"
 * - GET: Obtiene la información (crea default si no existe)
 * - PUT: Actualiza la información
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para la información de la empresa
const aboutUsSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  imageUrl: z.string().optional(), // Foto de la empresa
  phone: z.string().optional(), // Teléfono de contacto
  email: z.string().email().optional(), // Email de contacto
  address: z.string().optional(), // Dirección física
})

/**
 * GET /api/about-us
 * Obtiene la información de la empresa
 * Si no existe, crea un registro default
 */
export async function GET() {
  try {
    let aboutUs = await prisma.aboutUs.findFirst()
    
    // Si no existe, crear uno por defecto
    if (!aboutUs) {
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

/**
 * PUT /api/about-us
 * Actualiza la información de la empresa
 * Si no existe, la crea. Si existe, la actualiza.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    // Validar que los datos cumplan con el esquema
    const validated = aboutUsSchema.parse(body)

    let aboutUs = await prisma.aboutUs.findFirst()

    if (!aboutUs) {
      // Crear si no existe
      aboutUs = await prisma.aboutUs.create({
        data: validated,
      })
    } else {
      // Actualizar si existe
      aboutUs = await prisma.aboutUs.update({
        where: { id: aboutUs.id },
        data: validated,
      })
    }

    return NextResponse.json(aboutUs)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retornar errores de validación
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to update about us' }, { status: 500 })
  }
}
