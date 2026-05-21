'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Booking>>({})

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

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.id)
    setEditData({
      name: booking.name,
      lastName: booking.lastName,
      email: booking.email,
      dateTime: booking.dateTime,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      const res = await fetch(`/api/bookings/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
      if (res.ok) {
        const updatedBooking = await res.json()
        setBookings(bookings.map(b => b.id === editingId ? updatedBooking : b))
        setEditingId(null)
        setEditData({})
        alert('Turno actualizado exitosamente')
      } else {
        alert('Error al actualizar')
      }
    } catch (error) {
      console.error('Error updating:', error)
      alert('Error al actualizar')
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFFACD 0%, #FFB3D9 100%)' }}>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg" style={{ boxShadow: '0 4px 20px rgba(255, 179, 217, 0.15)' }}>
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#333333' }}>Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-2 border rounded-md mb-4"
            style={{ borderColor: '#FFB3D9', color: '#333333' }}
          />
          <button type="submit" className="w-full text-white p-2 rounded-md font-semibold transition-all hover:shadow-md" style={{ backgroundColor: '#FFB3D9' }}>
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #FFFACD 0%, #FFB3D9 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>Panel de Administración</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/content"
              className="text-white px-4 py-2 rounded hover:shadow-md transition-all"
              style={{ backgroundColor: '#CCFF00', color: '#333333' }}
            >
              Gestionar Contenido
            </Link>
            <button
              onClick={handleLogout}
              className="text-white px-4 py-2 rounded hover:shadow-md transition-all"
              style={{ backgroundColor: '#FFB3D9' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#333333' }}>Cargando...</p>
        ) : sortedBookings.length === 0 ? (
          <p style={{ color: '#333333' }}>No hay turnos agendados.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(255, 179, 217, 0.15)' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: '#F0F0F0' }}>
                <tr style={{ borderBottomColor: '#FFB3D9' }}>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#333333' }}>Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#333333' }}>Servicio</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#333333' }}>Fecha y Hora</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#333333' }}>Email</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#333333' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => (
                  <tr key={booking.id} className="transition-colors" style={{ borderTopColor: '#FFB3D9', color: '#333333' }}>
                    <td className="px-4 py-3">{booking.name} {booking.lastName}</td>
                    <td className="px-4 py-3">{booking.service.name}</td>
                    <td className="px-4 py-3">
                      {format(new Date(booking.dateTime), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </td>
                    <td className="px-4 py-3">{booking.email}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="text-white px-3 py-1 rounded transition-all hover:shadow-md"
                        style={{ backgroundColor: '#CCFF00', color: '#333333' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-white px-3 py-1 rounded transition-all hover:shadow-md"
                        style={{ backgroundColor: '#FFB3D9' }}
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

        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>Editar Turno</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Nombre</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Apellido</label>
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Email</label>
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Fecha y Hora</label>
                  <input
                    type="datetime-local"
                    value={editData.dateTime ? new Date(editData.dateTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditData({ ...editData, dateTime: new Date(e.target.value).toISOString() })}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 text-white p-3 rounded-md font-semibold transition-all hover:shadow-md"
                    style={{ backgroundColor: '#CCFF00', color: '#333333' }}
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 text-white p-3 rounded-md font-semibold transition-all hover:shadow-md"
                    style={{ backgroundColor: '#FFB3D9' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}