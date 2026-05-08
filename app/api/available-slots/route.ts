import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, parse, parseISO, addHours, setHours, setMinutes, getDay, startOfDay, endOfDay } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

const TIMEZONE = 'America/Argentina/Buenos_Aires'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 })
    }

    const date = parse(dateParam, 'yyyy-MM-dd', new Date())
    const dayOfWeek = getDay(date) // 0 = Sun, 1 = Mon, ..., 6 = Sat

    let startHour: number
    let endHour: number

    if (dayOfWeek === 0) {
      // Sunday, no slots
      return NextResponse.json([])
    } else if (dayOfWeek === 6) {
      // Saturday
      startHour = 10
      endHour = 19
    } else {
      // Monday to Friday
      startHour = 9
      endHour = 20
    }

    // Generate possible slots
    const slots = []
    for (let hour = startHour; hour < endHour; hour++) {
      const start = setMinutes(setHours(date, hour), 0)
      const end = addHours(start, 1)
      slots.push({ start: start.toISOString(), end: end.toISOString() })
    }

    // Get booked slots for the day
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)

    const bookings = await prisma.booking.findMany({
      where: {
        dateTime: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
      select: {
        dateTime: true,
      },
    })

    const bookedTimes = new Set(bookings.map(b => b.dateTime.toISOString()))

    // Filter available slots
    const availableSlots = slots.filter(slot => !bookedTimes.has(slot.start))

    return NextResponse.json({ availableSlots, debug: { dayOfWeek, dateParam, slotsCount: slots.length, bookingsCount: bookings.length } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}