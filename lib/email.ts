import nodemailer from 'nodemailer'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'America/Argentina/Buenos_Aires'

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface SendBookingEmailProps {
  clientName: string
  clientLastName: string
  clientEmail: string
  serviceType: string
  dateTime: Date
  recipientEmail: string
}

export async function sendBookingEmail({
  clientName,
  clientLastName,
  clientEmail,
  serviceType,
  dateTime,
  recipientEmail,
}: SendBookingEmailProps) {
  try {
    const zonedDate = toZonedTime(dateTime, TIMEZONE)
    const formattedDate = format(zonedDate, 'dd/MM/yyyy')
    const formattedTime = format(zonedDate, 'HH:mm')

    const subject = `Reserva | ${serviceType} ${formattedDate}`
    const body = `Se agendo el turno del tipo ${serviceType} para ${clientName} ${clientLastName} en el horario de las ${formattedTime}. Revisar calendario`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      text: body,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Nueva Reserva</h2>
          <p>${body}</p>
          <p><strong>Cliente:</strong> ${clientEmail}</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${recipientEmail}`)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
