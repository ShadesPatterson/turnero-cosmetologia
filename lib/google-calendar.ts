import { google } from 'googleapis'
import path from 'path'

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
})

const calendar = google.calendar({ version: 'v3', auth })

export async function addEventToCalendar(summary: string, start: string, end: string) {
  try {
    const event = {
      summary,
      start: {
        dateTime: start,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: end,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
    }

    const response = await calendar.events.insert({
      calendarId: 'catala.marialuz@gmail.com', // Use the specified calendar
      resource: event,
    })

    console.log('Event created:', response.data.htmlLink)
    return response.data
  } catch (error) {
    console.error('Error adding event to calendar:', error)
    throw error
  }
}