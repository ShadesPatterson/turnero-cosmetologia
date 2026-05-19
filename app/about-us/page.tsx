'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/app/components/Navbar'

interface AboutUsData {
  id: number
  title: string
  description: string
  imageUrl: string | null
  phone: string | null
  email: string | null
  address: string | null
}

export default function AboutUs() {
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutUs()
  }, [])

  const fetchAboutUs = async () => {
    try {
      const res = await fetch('/api/about-us')
      if (res.ok) {
        const data = await res.json()
        setAboutUs(data)
      }
    } catch (error) {
      console.error('Error fetching about us:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF9F7 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 py-16">
          {loading ? (
            <p className="text-center text-xl">Cargando...</p>
          ) : aboutUs ? (
            <div>
              <h1 className="text-5xl font-bold text-center mb-12" style={{ color: '#403B38' }}>
                {aboutUs.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  {aboutUs.imageUrl && (
                    <img
                      src={aboutUs.imageUrl}
                      alt={aboutUs.title}
                      className="w-full rounded-lg shadow-lg"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-lg mb-6" style={{ color: '#7A6F6A', lineHeight: '1.8' }}>
                    {aboutUs.description}
                  </p>

                  <div className="space-y-4">
                    {aboutUs.phone && (
                      <div>
                        <h3 className="font-semibold" style={{ color: '#403B38' }}>Teléfono</h3>
                        <a href={`tel:${aboutUs.phone}`} style={{ color: '#CDA291' }}>
                          {aboutUs.phone}
                        </a>
                      </div>
                    )}
                    {aboutUs.email && (
                      <div>
                        <h3 className="font-semibold" style={{ color: '#403B38' }}>Email</h3>
                        <a href={`mailto:${aboutUs.email}`} style={{ color: '#CDA291' }}>
                          {aboutUs.email}
                        </a>
                      </div>
                    )}
                    {aboutUs.address && (
                      <div>
                        <h3 className="font-semibold" style={{ color: '#403B38' }}>Dirección</h3>
                        <p style={{ color: '#7A6F6A' }}>{aboutUs.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">No hay información disponible</p>
          )}
        </div>
      </div>
    </>
  )
}
