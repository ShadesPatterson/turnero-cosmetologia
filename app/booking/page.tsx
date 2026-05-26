'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const bookingSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  serviceId: z.number().int().positive('Servicio requerido'),
})

type BookingForm = z.infer<typeof bookingSchema>

interface Slot {
  start: string
  end: string
}

interface Service {
  id: number
  name: string
  duration: number
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  })

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchAvailableSlots = async (date: Date) => {
    setLoading(true)
    try {
      const formattedDate = format(date, 'yyyy-MM-dd')
      const res = await fetch(`/api/available-slots?date=${formattedDate}`)
      if (res.ok) {
        const data = await res.json()
        setAvailableSlots(data.availableSlots || [])
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
    if (services.length > 0) {
      setValue('serviceId', services[0].id)
    }
  }

  const onSubmit = async (data: BookingForm) => {
    if (!selectedSlot) return

    setBookingLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dateTime: selectedSlot.start,
        }),
      })
      if (res.ok) {
        alert('Turno agendado exitosamente!')
        reset()
        setSelectedSlot(null)
        if (selectedDate) {
          fetchAvailableSlots(selectedDate)
        }
      } else {
        const error = await res.json()
        alert('Error: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error booking:', error)
      alert('Error al agendar turno')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #FFFACD 0%, #FFB3D9 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#333333' }}>Agendar Turno - Cosmetología</h1>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6" style={{ boxShadow: '0 4px 20px rgba(255, 179, 217, 0.15)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#333333' }}>Seleccionar Fecha</h2>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="dd/MM/yyyy"
              locale={es}
              minDate={new Date()}
              className="w-full p-2 rounded-md"
              placeholderText="Selecciona una fecha"
              style={{ borderColor: '#FFB3D9', color: '#333333' }}
            />
          </div>

          {selectedDate && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6" style={{ boxShadow: '0 4px 20px rgba(255, 179, 217, 0.15)' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#333333' }}>
                Horarios Disponibles - {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
              </h2>
              {loading ? (
                <p>Cargando...</p>
              ) : availableSlots.length === 0 ? (
                <p>No hay horarios disponibles para esta fecha</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className="p-2 rounded border transition-all hover:shadow-md"
                      style={{ backgroundColor: '#F0F0F0', color: '#333333', borderColor: '#FFB3D9' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#CCFF00'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#F0F0F0'}
                    >
                      {format(new Date(slot.start), 'HH:mm')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedSlot && (
            <div className="bg-white p-6 rounded-lg shadow-lg" style={{ boxShadow: '0 4px 20px rgba(255, 179, 217, 0.15)' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#333333' }}>
                Agendar Turno - {format(new Date(selectedSlot.start), 'dd/MM/yyyy HH:mm', { locale: es })}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium" style={{ color: '#333333' }}>Nombre</label>
                  <input
                    {...register('name')}
                    className="w-full p-2 rounded-md border"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  />
                  {errors.name && <p className="text-sm" style={{ color: '#FFB3D9' }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium" style={{ color: '#333333' }}>Apellido</label>
                  <input
                    {...register('lastName')}
                    className="w-full p-2 rounded-md border"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  />
                  {errors.lastName && <p className="text-sm" style={{ color: '#FFB3D9' }}>{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium" style={{ color: '#333333' }}>Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full p-2 rounded-md border"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  />
                  {errors.email && <p className="text-sm" style={{ color: '#FFB3D9' }}>{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium" style={{ color: '#333333' }}>Servicio</label>
                  <select
                    {...register('serviceId', { valueAsNumber: true })}
                    className="w-full p-2 rounded-md border"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  >
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="text-sm" style={{ color: '#FFB3D9' }}>{errors.serviceId.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full p-3 rounded-md font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: '#CCFF00', color: '#333333' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FFB3D9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#CCFF00'}
                >
                  {bookingLoading ? 'Agendando...' : 'Agendar Turno'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
