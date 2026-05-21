/**
 * Módulo de Google Calendar - Integración con Google Calendar
 * 
 * Permite:
 * - Agregar eventos de reservas automáticamente al calendario
 * - Eliminar eventos cuando se cancela una reserva
 * 
 * Requiere archivo de credenciales: google-credentials.json
 */

import { google } from 'googleapis'
import path from 'path'

/**
 * Configurar autenticación con Google
 * Utiliza credenciales de servicio (service account)
 * El archivo google-credentials.json debe estar en la raíz del proyecto
 */
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/calendar'], // Permiso para acceder al calendario
})

// Instancia del cliente de Google Calendar v3
const calendar = google.calendar({ version: 'v3', auth })

/**
 * Agregar un evento al Google Calendar
 * 
 * @param summary - Título del evento (ej: "Juan García - Lifting facial")
 * @param start - Fecha/hora de inicio (ISO string)
 * @param end - Fecha/hora de fin (ISO string)
 * @returns ID del evento creado (necesario para eliminar después)
 * 
 * El evento se crea en el calendario de: catala.marialuz@gmail.com
 */
export async function addEventToCalendar(summary: string, start: string, end: string): Promise<string> {
  try {
    // Configurar el evento
    const event = {
      summary, // Título
      start: {
        dateTime: start, // Fecha y hora de inicio
        timeZone: 'America/Argentina/Buenos_Aires', // Zona horaria
      },
      end: {
        dateTime: end, // Fecha y hora de fin
        timeZone: 'America/Argentina/Buenos_Aires',
      },
    }

    // Insertar el evento en el calendario
    const response = await calendar.events.insert({
      calendarId: 'catala.marialuz@gmail.com', // Calendario específico
      resource: event,
    })

    // Log para debugging
    console.log('Event created:', response.data.htmlLink)
    
    // Retornar el ID del evento (lo guardamos en la BD para poder eliminarlo después)
    return response.data.id!
  } catch (error) {
    console.error('Error adding event to calendar:', error)
    throw error
  }
}

/**
 * Eliminar un evento del Google Calendar
 * 
 * @param eventId - ID del evento a eliminar (se obtuvo al crear)
 * 
 * Se llama cuando se cancela una reserva
 */
export async function deleteEventFromCalendar(eventId: string) {
  try {
    // Eliminar el evento del calendario
    await calendar.events.delete({
      calendarId: 'catala.marialuz@gmail.com',
      eventId,
    })
    console.log('Event deleted:', eventId)
  } catch (error) {
    console.error('Error deleting event from calendar:', error)
    throw error
  }
}