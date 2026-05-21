/**
 * Panel de Administración - Gestión de Contenido
 * 
 * Permite:
 * 1. Agregar contenido (imágenes y videos) a la galería
 * 2. Eliminar contenido existente
 * 3. Editar información de "Sobre Nosotros"
 * 
 * Acceso: /admin/content (requiere login en /admin)
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Interfaz para el contenido (imágenes/videos)
 */
interface Content {
  id: number
  title: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
  order: number
}

/**
 * Interfaz para la información de la empresa
 */
interface AboutUsData {
  id: number
  title: string
  description: string
  imageUrl: string | null
  phone: string | null
  email: string | null
  address: string | null
}

/**
 * Página principal del panel de admin de contenido
 * Dos pestañas: Contenido y Sobre Nosotros
 */
export default function AdminPage() {
  const router = useRouter()
  
  // Estado de la pestaña activa
  const [activeTab, setActiveTab] = useState<'content' | 'about'>('content')
  
  // Lista de contenidos (imágenes/videos)
  const [contentList, setContentList] = useState<Content[]>([])
  
  // Información de la empresa
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null)
  
  // Indicador de carga
  const [loading, setLoading] = useState(true)

  // Estados para editar contenido
  const [editingId, setEditingId] = useState<number | null>(null)

  // ===== ESTADOS PARA EL FORMULARIO DE CONTENIDO =====
  const [contentTitle, setContentTitle] = useState('')
  const [contentDescription, setContentDescription] = useState('')
  const [contentImageUrl, setContentImageUrl] = useState('')
  const [contentVideoUrl, setContentVideoUrl] = useState('')
  const [contentOrder, setContentOrder] = useState(0)

  // ===== ESTADOS PARA EL FORMULARIO DE SOBRE NOSOTROS =====
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutDescription, setAboutDescription] = useState('')
  const [aboutImageUrl, setAboutImageUrl] = useState('')
  const [aboutPhone, setAboutPhone] = useState('')
  const [aboutEmail, setAboutEmail] = useState('')
  const [aboutAddress, setAboutAddress] = useState('')

  // Cargar datos al iniciar el componente
  useEffect(() => {
    fetchData()
  }, [])

  /**
   * Obtener todos los datos del servidor
   * - Lista de contenidos
   * - Información de "Sobre Nosotros"
   */
  const fetchData = async () => {
    try {
      // Hacer ambas peticiones en paralelo
      const [contentRes, aboutRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/about-us'),
      ])

      // Procesar respuesta de contenido
      if (contentRes.ok) {
        const data = await contentRes.json()
        setContentList(data)
      }

      // Procesar respuesta de sobre nosotros
      if (aboutRes.ok) {
        const data = await aboutRes.json()
        setAboutUs(data)
        // Llenar el formulario con los datos existentes
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

  /**
   * Agregar nuevo contenido a la galería
   * Valida campos requeridos y envía a la API
   */
  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos obligatorios
    if (!contentTitle || !contentDescription) {
      alert('Por favor completa los campos requeridos')
      return
    }

    try {
      // Enviar datos a la API
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: contentTitle,
          description: contentDescription,
          imageUrl: contentImageUrl || undefined, // Puede ser opcional
          videoUrl: contentVideoUrl || undefined, // Puede ser opcional
          order: contentOrder,
        }),
      })

      if (res.ok) {
        alert('Contenido agregado exitosamente')
        // Limpiar formulario
        setContentTitle('')
        setContentDescription('')
        setContentImageUrl('')
        setContentVideoUrl('')
        setContentOrder(0)
        // Recargar la lista de contenidos
        fetchData()
      } else {
        alert('Error al agregar contenido')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al agregar contenido')
    }
  }

  /**
   * Eliminar un contenido de la galería
   * Requiere confirmación antes de eliminar
   */
  const handleDeleteContent = async (id: number) => {
    // Pedir confirmación al usuario
    if (confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
      try {
        const res = await fetch(`/api/content/${id}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          alert('Contenido eliminado')
          // Recargar la lista
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

  /**
   * Iniciar edición de un contenido
   */
  const handleEditContent = (content: Content) => {
    setEditingId(content.id)
    setContentTitle(content.title)
    setContentDescription(content.description)
    setContentImageUrl(content.imageUrl || '')
    setContentVideoUrl(content.videoUrl || '')
    setContentOrder(content.order)
  }

  /**
   * Guardar cambios de contenido editado
   */
  const handleSaveEditContent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contentTitle || !contentDescription) {
      alert('Por favor completa los campos requeridos')
      return
    }

    try {
      const res = await fetch(`/api/content/${editingId}`, {
        method: 'PUT',
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
        alert('Contenido actualizado exitosamente')
        setEditingId(null)
        setContentTitle('')
        setContentDescription('')
        setContentImageUrl('')
        setContentVideoUrl('')
        setContentOrder(0)
        fetchData()
      } else {
        alert('Error al actualizar contenido')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar contenido')
    }
  }

  /**
   * Cancelar edición
   */
  const handleCancelEdit = () => {
    setEditingId(null)
    setContentTitle('')
    setContentDescription('')
    setContentImageUrl('')
    setContentVideoUrl('')
    setContentOrder(0)
  }

  /**
   * Actualizar la información de "Sobre Nosotros"
   * Incluye: título, descripción, imagen, teléfono, email, dirección
   */
  const handleUpdateAboutUs = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos obligatorios
    if (!aboutTitle || !aboutDescription) {
      alert('Por favor completa los campos requeridos')
      return
    }

    try {
      // Enviar actualización a la API
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFFACD 0%, #FFB3D9 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#333333' }}>Panel de Administración</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 rounded text-white font-semibold"
            style={{ backgroundColor: '#FFB3D9' }}
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
              backgroundColor: activeTab === 'content' ? '#CCFF00' : '#F0F0F0',
              color: activeTab === 'content' ? '#333333' : '#555555',
            }}
          >
            Contenido
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className="px-6 py-3 rounded-lg font-semibold transition"
            style={{
              backgroundColor: activeTab === 'about' ? '#CCFF00' : '#F0F0F0',
              color: activeTab === 'about' ? '#333333' : '#555555',
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
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>
                {editingId ? 'Editar Contenido' : 'Agregar Contenido'}
              </h2>
              <form onSubmit={editingId ? handleSaveEditContent : handleAddContent} className="space-y-4">
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
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>Contenido Existente</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {contentList.length === 0 ? (
                  <p style={{ color: '#555555' }}>No hay contenido aún</p>
                ) : (
                  contentList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded"
                      style={{ borderColor: '#FFB3D9', backgroundColor: '#F9F9F9' }}
                    >
                      <h3 className="font-semibold" style={{ color: '#333333' }}>{item.title}</h3>
                      <p className="text-sm" style={{ color: '#555555' }}>{item.description.substring(0, 100)}...</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditContent(item)}
                          className="px-3 py-1 rounded text-sm font-semibold transition hover:shadow-md text-white"
                          style={{ backgroundColor: '#CCFF00', color: '#333333' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="px-3 py-1 rounded text-sm font-semibold transition hover:shadow-md text-white"
                          style={{ backgroundColor: '#FFB3D9' }}
                        >
                          Eliminar
                        </button>
                      </div>
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
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>Editar Sobre Nosotros</h2>
            <form onSubmit={handleUpdateAboutUs} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>Título *</label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#FFB3D9', color: '#333333' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>Descripción *</label>
                <textarea
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>URL de Imagen</label>
                <input
                  type="url"
                  value={aboutImageUrl}
                  onChange={(e) => setAboutImageUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#FFB3D9', color: '#333333' }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>Teléfono</label>
                <input
                  type="tel"
                  value={aboutPhone}
                  onChange={(e) => setAboutPhone(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#FFB3D9', color: '#333333' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>Email</label>
                <input
                  type="email"
                  value={aboutEmail}
                  onChange={(e) => setAboutEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#FFB3D9', color: '#333333' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>Dirección</label>
                <input
                  type="text"
                  value={aboutAddress}
                  onChange={(e) => setAboutAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: '#FFB3D9', color: '#333333' }}
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 rounded font-semibold transition hover:shadow-lg text-white"
                style={{ backgroundColor: '#CCFF00', color: '#333333' }}
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
