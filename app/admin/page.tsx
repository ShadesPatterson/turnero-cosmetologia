'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Booking {
  id: number
  name: string
  lastName: string
  email: string
  dateTime: string
  service: {
    name: string
  }
}

export default function Admin() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (loggedIn) {
      fetchBookings()
    }
  }, [loggedIn])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') { // Simple password
      setLoggedIn(true)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  const handleCancel = async (id: number) => {
    if (!confirm('¿Cancelar este turno?')) return

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setBookings(bookings.filter(b => b.id !== id))
      } else {
        alert('Error al cancelar')
      }
    } catch (error) {
      console.error('Error canceling:', error)
      alert('Error al cancelar')
    }
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setPassword('')
  }

  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  )

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF9F7 100%)' }}>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg" style={{ boxShadow: '0 4px 20px rgba(205, 162, 145, 0.15)' }}>
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#403B38' }}>Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-2 border rounded-md mb-4"
            style={{ borderColor: '#CDA291', color: '#403B38' }}
          />
          <button type="submit" className="w-full text-white p-2 rounded-md font-semibold transition-all hover:shadow-md" style={{ backgroundColor: '#CDA291' }}>
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF9F7 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#403B38' }}>Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="text-white px-4 py-2 rounded hover:shadow-md transition-all"
            style={{ backgroundColor: '#CDA291' }}
          >
            Cerrar Sesión
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#403B38' }}>Cargando...</p>
        ) : sortedBookings.length === 0 ? (
          <p style={{ color: '#403B38' }}>No hay turnos agendados.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(205, 162, 145, 0.15)' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: '#FFF5F5' }}>
                <tr style={{ borderBottomColor: '#CDA291' }}>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#403B38' }}>Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#403B38' }}>Servicio</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#403B38' }}>Fecha y Hora</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#403B38' }}>Email</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#403B38' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => (
                  <tr key={booking.id} className="transition-colors" style={{ borderTopColor: '#E8D4CC', color: '#403B38' }}>
                    <td className="px-4 py-3">{booking.name} {booking.lastName}</td>
                    <td className="px-4 py-3">{booking.service.name}</td>
                    <td className="px-4 py-3">
                      {format(new Date(booking.dateTime), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </td>
                    <td className="px-4 py-3">{booking.email}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-white px-3 py-1 rounded transition-all hover:shadow-md"
                        style={{ backgroundColor: '#CDA291' }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}