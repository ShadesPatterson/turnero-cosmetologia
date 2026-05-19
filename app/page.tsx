'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from './components/Navbar'

interface Content {
  id: number
  title: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
}

export default function Home() {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

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
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF9F7 100%)' }}>
        {/* Hero Section */}
        <section className="py-16 px-4" style={{ borderBottom: '2px solid #CDA291' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#403B38' }}>
              Cosmética María Luz
            </h1>
            <p className="text-xl mb-8" style={{ color: '#7A6F6A' }}>
              Tratamientos de belleza de alta calidad para realzar tu natural
            </p>
            <Link href="/booking" className="inline-block px-8 py-3 rounded-lg text-white font-semibold text-lg hover:shadow-lg transition" style={{ backgroundColor: '#CDA291' }}>
              Agendar Turno Ahora
            </Link>
          </div>
        </section>

        {/* Content Gallery */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#403B38' }}>
              Nuestros Trabajos
            </h2>

            {loading ? (
              <p className="text-center text-xl">Cargando contenido...</p>
            ) : content.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl mb-4" style={{ color: '#7A6F6A' }}>Sin contenido disponible aún</p>
                <p style={{ color: '#7A6F6A' }}>Por favor, vuelve más tarde</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                    style={{ backgroundColor: 'white' }}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                    )}
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
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#403B38' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: '#7A6F6A' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4" style={{ backgroundColor: '#FFF5F5', borderTop: '2px solid #CDA291' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#403B38' }}>
              ¿Listo para transformarte?
            </h2>
            <p className="text-xl mb-8" style={{ color: '#7A6F6A' }}>
              Agenda tu turno y descubre nuestros servicios de calidad
            </p>
            <Link href="/booking" className="inline-block px-8 py-3 rounded-lg text-white font-semibold text-lg hover:shadow-lg transition" style={{ backgroundColor: '#CDA291' }}>
              Agendar Turno
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
