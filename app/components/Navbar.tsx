'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Componente Navbar - Barra de navegación principal
 * Se muestra en todas las páginas públicas (Home, Booking, About Us)
 * Incluye menú responsivo para dispositivos móviles
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navLinkStyle = (path: string) => ({
    color: isActive(path) ? '#CCFF00' : '#333333',
    fontWeight: isActive(path) ? 600 : 400,
    borderBottom: isActive(path) ? '2px solid #CCFF00' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  })

  return (
    <nav className="bg-white shadow-md" style={{ borderBottom: '3px solid #CCFF00' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Título de la empresa */}
        <Link href="/" className="text-2xl font-bold" style={{ color: '#333333' }}>
          Catalea beauty center
        </Link>

        {/* Botón menú para móviles */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{ color: '#333333' }}
        >
          ☰
        </button>

        {/* Menú de escritorio - visible solo en pantallas medianas y mayores */}
        <div className="hidden md:flex gap-6">
          <Link
            href="/"
            style={navLinkStyle('/')}
            onMouseEnter={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.color = '#CCFF00'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.color = '#333333'
              }
            }}
          >
            Home
          </Link>
          <Link
            href="/about-us"
            style={navLinkStyle('/about-us')}
            onMouseEnter={(e) => {
              if (!isActive('/about-us')) {
                e.currentTarget.style.color = '#CCFF00'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/about-us')) {
                e.currentTarget.style.color = '#333333'
              }
            }}
          >
            Sobre Nosotros
          </Link>
          {/* Botón destacado para ir a agendar turno */}
          <Link
            href="/booking"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              color: isActive('/booking') ? '#333333' : '#FFFFFF',
              fontWeight: isActive('/booking') ? 600 : 500,
              transition: 'all 0.3s ease',
              backgroundColor: isActive('/booking') ? '#CCFF00' : '#FFB3D9',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#CCFF00'
              e.currentTarget.style.color = '#333333'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(204, 255, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isActive('/booking') ? '#CCFF00' : '#FFB3D9'
              e.currentTarget.style.color = isActive('/booking') ? '#333333' : '#FFFFFF'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Agendar Turno
          </Link>
        </div>

        {/* Menú móvil - visible solo cuando menuOpen es true */}
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg md:hidden z-50" style={{ backgroundColor: '#FFFFFF' }}>
            <Link
              href="/"
              className="block px-4 py-2 transition"
              style={{
                color: isActive('/') ? '#CCFF00' : '#333333',
                backgroundColor: isActive('/') ? '#f0f0f0' : 'transparent',
                fontWeight: isActive('/') ? 600 : 400,
                borderLeft: isActive('/') ? '3px solid #CCFF00' : '3px solid transparent',
                paddingLeft: isActive('/') ? '13px' : '16px',
              }}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className="block px-4 py-2 transition"
              style={{
                color: isActive('/about-us') ? '#CCFF00' : '#333333',
                backgroundColor: isActive('/about-us') ? '#f0f0f0' : 'transparent',
                fontWeight: isActive('/about-us') ? 600 : 400,
                borderLeft: isActive('/about-us') ? '3px solid #CCFF00' : '3px solid transparent',
                paddingLeft: isActive('/about-us') ? '13px' : '16px',
              }}
              onClick={() => setMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/booking"
              className="block px-4 py-2 transition font-semibold"
              style={{
                backgroundColor: isActive('/booking') ? '#CCFF00' : '#FFB3D9',
                color: isActive('/booking') ? '#333333' : '#FFFFFF',
                margin: '8px 4px',
                borderRadius: '6px',
              }}
              onClick={() => setMenuOpen(false)}
            >
              Agendar Turno
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
