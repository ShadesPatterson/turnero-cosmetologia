import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { parseISO, addHours } from 'date-fns'
import { addEventToCalendar } from '@/lib/google-calendar'

const bookingSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  serviceId: z.number().int().positive(),
  dateTime: z.string().datetime(),
})

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      service: true,
    },
  })
  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = bookingSchema.parse(body)

    const dateTime = parseISO(validated.dateTime)
    const endTime = addHours(dateTime, 1) // Assume 1 hour for now

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: validated.serviceId },
    })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 400 })
    }

    // Check if slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        dateTime: dateTime,
      },
    })
    if (existingBooking) {
      return NextResponse.json({ error: 'Slot not available' }, { status: 400 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        name: validated.name,
        lastName: validated.lastName,
        email: validated.email,
        serviceId: validated.serviceId,
        dateTime: dateTime,
      },
      include: {
        service: true,
      },
    })

    // Add to Google Calendar
    try {
      await addEventToCalendar(
        `${booking.name} ${booking.lastName} - ${service.name}`,
        dateTime.toISOString(),
        endTime.toISOString()
      )
    } catch (error) {
      console.error('Failed to add to calendar:', error)
      // Don't fail the booking if calendar fails
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}