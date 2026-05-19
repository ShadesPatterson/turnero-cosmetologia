'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Content {
  id: number
  title: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
  order: number
}

interface AboutUsData {
  id: number
  title: string
  description: string
  imageUrl: string | null
  phone: string | null
  email: string | null
  address: string | null
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'content' | 'about'>('content')
  const [contentList, setContentList] = useState<Content[]>([])
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Content form state
  const [contentTitle, setContentTitle] = useState('')
  const [contentDescription, setContentDescription] = useState('')
  const [contentImageUrl, setContentImageUrl] = useState('')
  const [contentVideoUrl, setContentVideoUrl] = useState('')
  const [contentOrder, setContentOrder] = useState(0)

  // About Us form state
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutDescription, setAboutDescription] = useState('')
  const [aboutImageUrl, setAboutImageUrl] = useState('')
  const [aboutPhone, setAboutPhone] = useState('')
  const [aboutEmail, setAboutEmail] = useState('')
  const [aboutAddress, setAboutAddress] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contentRes, aboutRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/about-us'),
      ])

      if (contentRes.ok) {
        const data = await contentRes.json()
        setContentList(data)
      }

      if (aboutRes.ok) {
        const data = await aboutRes.json()
        setAboutUs(data)
        setAboutTitle(data.title)
        setAboutDescription(data.description)
        setAboutImageUrl(data.imageUrl || '')
        setAboutPhone(data.phone || '')
        setAboutEmail(data.email || '')
        setAboutAddress(data.address || '')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contentTitle || !contentDescription) {
      alert('Por favor completa los campos requeridos')
      return
    }

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: contentTitle,
          description: contentDescription,
          imageUrl: contentImageUrl || undefined,
          videoUrl: contentVideoUrl || undefined,
          order: contentOrder,
        }),
      })

      if (res.ok) {
        alert('Contenido agregado exitosamente')
        setContentTitle('')
        setContentDescription('')
        setContentImageUrl('')
        setContentVideoUrl('')
        setContentOrder(0)
        fetchData()
      } else {
        alert('Error al agregar contenido')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al agregar contenido')
    }
  }

  const handleDeleteContent = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
      try {
        const res = await fetch(`/api/content/${id}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          alert('Contenido eliminado')
          fetchData()
        } else {
          alert('Error al eliminar contenido')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar contenido')
      }
    }
  }

  const handleUpdateAboutUs = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aboutTitle || !aboutDescription) {
      alert('Por favor completa los campos requeridos')
      return
    }

    try {
      const res = await fetch('/api/about-us', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aboutTitle,
          description: aboutDescription,
          imageUrl: aboutImageUrl || undefined,
          phone: aboutPhone || undefined,
          email: aboutEmail || undefined,
          address: aboutAddress || undefined,
        }),
      })

      if (res.ok) {
        alert('Información actualizada exitosamente')
        fetchData()
      } else {
        alert('Error al actualizar información')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar información')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF5F5' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#403B38' }}>Panel de Administración</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 rounded text-white font-semibold"
            style={{ backgroundColor: '#403B38' }}
          >
            Volver al Panel
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('content')}
            className="px-6 py-3 rounded-lg font-semibold transition"
            style={{
              backgroundColor: activeTab === 'content' ? '#CDA291' : '#E8D4CC',
              color: activeTab === 'content' ? 'white' : '#403B38',
            }}
          >
            Contenido
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className="px-6 py-3 rounded-lg font-semibold transition"
            style={{
              backgroundColor: activeTab === 'about' ? '#CDA291' : '#E8D4CC',
              color: activeTab === 'about' ? 'white' : '#403B38',
            }}
          >
            Sobre Nosotros
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Content Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#403B38' }}>Agregar Contenido</h2>
              <form onSubmit={handleAddContent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Título *</label>
                  <input
                    type="text"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    style={{ borderColor: '#CDA291' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Descripción *</label>
                  <textarea
                    value={contentDescription}
                    onChange={(e) => setContentDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    style={{ borderColor: '#CDA291' }}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>URL de Imagen</label>
                  <input
                    type="url"
                    value={contentImageUrl}
                    onChange={(e) => setContentImageUrl(e.target.value)}
                    className="w-full p-2 border rounded"
                    style={{ borderColor: '#CDA291' }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>URL de Video (YouTube embed)</label>
                  <input
                    type="url"
                    value={contentVideoUrl}
                    onChange={(e) => setContentVideoUrl(e.target.value)}
                    className="w-full p-2 border rounded"
                    style={{ borderColor: '#CDA291' }}
                    placeholder="https://www.youtube.com/embed/xxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Orden</label>
                  <input
                    type="number"
                    value={contentOrder}
                    onChange={(e) => setContentOrder(parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    style={{ borderColor: '#CDA291' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-3 rounded text-white font-semibold transition hover:shadow-lg"
                  style={{ backgroundColor: '#CDA291' }}
                >
                  Agregar Contenido
                </button>
              </form>
            </div>

            {/* Content List */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#403B38' }}>Contenido Existente</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {contentList.length === 0 ? (
                  <p style={{ color: '#7A6F6A' }}>No hay contenido aún</p>
                ) : (
                  contentList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded"
                      style={{ borderColor: '#CDA291', backgroundColor: '#FFF9F7' }}
                    >
                      <h3 className="font-semibold" style={{ color: '#403B38' }}>{item.title}</h3>
                      <p className="text-sm" style={{ color: '#7A6F6A' }}>{item.description.substring(0, 100)}...</p>
                      <button
                        onClick={() => handleDeleteContent(item.id)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* About Us Tab */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#403B38' }}>Editar Sobre Nosotros</h2>
            <form onSubmit={handleUpdateAboutUs} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Título *</label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#CDA291' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Descripción *</label>
                <textarea
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#CDA291' }}
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>URL de Imagen</label>
                <input
                  type="url"
                  value={aboutImageUrl}
                  onChange={(e) => setAboutImageUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#CDA291' }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Teléfono</label>
                <input
                  type="tel"
                  value={aboutPhone}
                  onChange={(e) => setAboutPhone(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#CDA291' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Email</label>
                <input
                  type="email"
                  value={aboutEmail}
                  onChange={(e) => setAboutEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#CDA291' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#403B38' }}>Dirección</label>
                <input
                  type="text"
                  value={aboutAddress}
                  onChange={(e) => setAboutAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#CDA291' }}
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 rounded text-white font-semibold transition hover:shadow-lg"
                style={{ backgroundColor: '#CDA291' }}
              >
                Actualizar Información
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
