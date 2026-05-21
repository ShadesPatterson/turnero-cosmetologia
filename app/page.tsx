'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from './components/Navbar'

/**
 * Interfaz para el contenido (imágenes/videos) de la galería
 */
interface Content {
  id: number
  title: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
}

/**
 * Página Home - Landing Page Principal
 * Muestra:
 * 1. Hero section con información principal
 * 2. Galería de trabajos realizados
 * 3. Call-to-action para agendar turno
 */
export default function Home() {
  // Estado para almacenar el contenido de la galería
  const [content, setContent] = useState<Content[]>([])
  // Estado para mostrar indicador de carga
  const [loading, setLoading] = useState(true)

  // Al cargar el componente, obtener el contenido
  useEffect(() => {
    fetchContent()
  }, [])

  /**
   * Función para obtener el contenido desde la API
   * Realiza un GET a /api/content para traer todas las imágenes/videos
   */
  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content')
      if (res.ok) {
        const data = await res.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFFACD 0%, #FFB3D9 100%)' }}>
        {/* ===== SECCIÓN HERO ===== */}
        {/* Mensaje principal y CTA para agendar */}
        <section className="py-16 px-4" style={{ borderBottom: '2px solid #CCFF00' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#333333' }}>
              Catalea beauty center
            </h1>
            <p className="text-xl mb-8" style={{ color: '#555555' }}>
              Tratamientos de belleza de alta calidad para realzar tu natural
            </p>
            <Link href="/booking" className="inline-block px-8 py-3 rounded-lg text-white font-semibold text-lg hover:shadow-lg transition" style={{ backgroundColor: '#FFB3D9' }}>
              Agendar Turno Ahora
            </Link>
          </div>
        </section>

        {/* ===== SECCIÓN GALERÍA DE TRABAJOS ===== */}
        {/* Muestra imágenes y videos de trabajos realizados */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#333333' }}>
              Contenido informativo
            </h2>

            {loading ? (
              <p className="text-center text-xl">Cargando contenido...</p>
            ) : content.length === 0 ? (
              // Mensaje si no hay contenido cargado
              <div className="text-center py-12">
                <p className="text-xl mb-4" style={{ color: '#555555' }}>Sin contenido disponible aún</p>
                <p style={{ color: '#555555' }}>Por favor, vuelve más tarde</p>
              </div>
            ) : (
              // Grid responsivo de tarjetas de contenido
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                    style={{ backgroundColor: 'white' }}
                  >
                    {/* Mostrar imagen si existe */}
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    {/* Mostrar video si existe */}
                    {item.videoUrl && (
                      <div className="w-full h-64 bg-black flex items-center justify-center">
                        <iframe
                          width="100%"
                          height="100%"
                          src={item.videoUrl}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {/* Información del trabajo */}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#333333' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: '#555555' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== SECCIÓN CTA FINAL ===== */}
        {/* Call-to-action para animar al usuario a agendar */}
        <section className="py-16 px-4" style={{ backgroundColor: '#FFB3D9', borderTop: '2px solid #CCFF00' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#333333' }}>
              ¿Listo para transformarte?
            </h2>
            <p className="text-xl mb-8" style={{ color: '#555555' }}>
              Agenda tu turno y descubre nuestros servicios de calidad
            </p>
            <Link href="/booking" className="inline-block px-8 py-3 rounded-lg text-white font-semibold text-lg hover:shadow-lg transition" style={{ backgroundColor: '#CCFF00', color: '#333333' }}>
              Agendar Turno
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
