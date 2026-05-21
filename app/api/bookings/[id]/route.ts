import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteEventFromCalendar } from '@/lib/google-calendar'

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
    const { name, lastName, email, dateTime } = body

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        name: name || booking.name,
        lastName: lastName || booking.lastName,
        email: email || booking.email,
        dateTime: dateTime || booking.dateTime,
      },
      include: { service: true },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    })
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    console.log(`[DELETE] Booking found: ${booking.id}, eventId: ${booking.eventId}`)

    await prisma.booking.delete({
      where: { id },
    })

    console.log(`[DELETE] Booking deleted from DB`)

    // Remove from Google Calendar if eventId exists
    if (booking.eventId) {
      try {
        console.log(`[DELETE] Removing event ${booking.eventId} from calendar`)
        await deleteEventFromCalendar(booking.eventId)
        console.log(`[DELETE] Event removed successfully`)
      } catch (error) {
        console.error('Failed to remove from calendar:', error)
        // Don't fail the deletion if calendar removal fails
      }
    } else {
      console.log(`[DELETE] No eventId found, skipping calendar deletion`)
    }

    return NextResponse.json({ message: 'Booking canceled' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}