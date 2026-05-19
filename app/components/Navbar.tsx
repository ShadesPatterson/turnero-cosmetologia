'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md" style={{ borderBottom: '2px solid #CDA291' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" style={{ color: '#403B38' }}>
          Cosmética María Luz
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{ color: '#403B38' }}
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-amber-700 transition" style={{ color: '#403B38' }}>
            Home
          </Link>
          <Link href="/about-us" className="hover:text-amber-700 transition" style={{ color: '#403B38' }}>
            Sobre Nosotros
          </Link>
          <Link href="/booking" className="px-4 py-2 rounded-lg text-white font-semibold transition hover:shadow-lg" style={{ backgroundColor: '#CDA291' }}>
            Agendar Turno
          </Link>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg md:hidden" style={{ backgroundColor: '#FFF5F5' }}>
            <Link href="/" className="block px-4 py-2 hover:bg-gray-100" style={{ color: '#403B38' }} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about-us" className="block px-4 py-2 hover:bg-gray-100" style={{ color: '#403B38' }} onClick={() => setMenuOpen(false)}>
              Sobre Nosotros
            </Link>
            <Link href="/booking" className="block px-4 py-2 hover:bg-gray-100" style={{ color: '#403B38' }} onClick={() => setMenuOpen(false)}>
              Agendar Turno
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
