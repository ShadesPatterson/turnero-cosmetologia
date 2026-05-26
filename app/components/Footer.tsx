import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#FFB3D9', borderTop: '2px solid #CCFF00', padding: '30px 20px' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p style={{ color: '#333333', margin: 0, fontSize: '1rem' }}>
          Creado por Javier Altamirano
        </p>
        <Link
          href="https://www.linkedin.com/in/javier-altamirano-092648269/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded font-semibold transition hover:shadow-lg"
          style={{ backgroundColor: '#333333', color: '#CCFF00' }}
        >
          LinkedIn
        </Link>
      </div>
    </footer>
  )
}
