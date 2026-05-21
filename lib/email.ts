/**
 * Módulo de Email - Envío de confirmaciones de reserva
 * 
 * Utiliza nodemailer para enviar emails a través de Gmail
 * Se envía un email a catala.marialuz@gmail.com cuando se crea una reserva
 */

import nodemailer from 'nodemailer'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

// Zona horaria de Argentina
const TIMEZONE = 'America/Argentina/Buenos_Aires'

/**
 * Configurar el transporte de email
 * Usa Gmail como servidor SMTP
 * Las credenciales vienen de variables de entorno:
 * - EMAIL_USER: usuario de Gmail
 * - EMAIL_PASSWORD: contraseña de aplicación de Google
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * Interfaz con los parámetros para enviar email de reserva
 */
interface SendBookingEmailProps {
  clientName: string // Nombre del cliente
  clientLastName: string // Apellido del cliente
  clientEmail: string // Email del cliente
  serviceType: string // Tipo de servicio (ej: "Lifting facial")
  dateTime: Date // Fecha y hora del turno
  recipientEmail: string // Email de destino (admin)
}

/**
 * Envía email de confirmación de reserva
 * 
 * @param props - Datos de la reserva
 * 
 * Formato del email:
 * - Asunto: "Reserva | [Tipo de Servicio] [Fecha]"
 * - Cuerpo: "Se agendo el turno del tipo [Tipo] para [Nombre] [Apellido] en el horario de las [Hora]"
 */
export async function sendBookingEmail({
  clientName,
  clientLastName,
  clientEmail,
  serviceType,
  dateTime,
  recipientEmail,
}: SendBookingEmailProps) {
  try {
    // Convertir la fecha UTC a la zona horaria de Argentina
    const zonedDate = toZonedTime(dateTime, TIMEZONE)
    // Formatear la fecha como "dd/MM/yyyy"
    const formattedDate = format(zonedDate, 'dd/MM/yyyy')
    // Formatear la hora como "HH:mm"
    const formattedTime = format(zonedDate, 'HH:mm')

    // Construir el asunto del email
    const subject = `Reserva | ${serviceType} ${formattedDate}`
    
    // Construir el cuerpo del email
    const body = `Se agendo el turno del tipo ${serviceType} para ${clientName} ${clientLastName} en el horario de las ${formattedTime}. Revisar calendario`

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Remitente
      to: recipientEmail, // Destinatario (admin)
      subject,
      text: body, // Versión de texto plano
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Nueva Reserva</h2>
          <p>${body}</p>
          <p><strong>Cliente:</strong> ${clientEmail}</p>
        </div>
      `, // Versión HTML
    }

    // Enviar el email
    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${recipientEmail}`)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
