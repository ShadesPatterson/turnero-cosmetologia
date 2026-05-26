'use client'

import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function AboutUs() {
  const router = useRouter()
  const styles = {
    root: {
      fontFamily: "'Montserrat', sans-serif",
      background: 'linear-gradient(135deg, #FFFACD 0%, #FFB3D9 100%)',
      color: '#333333',
      margin: 0,
      minHeight: '100vh',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '100px 20px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center',
    } as React.CSSProperties,
    imageContainer: {
      position: 'relative' as const,
    },
    image: {
      width: '100%',
      height: 'auto',
      borderRadius: '2px',
      filter: 'grayscale(10%)',
    },
    imageOverlay: {
      content: '""',
      position: 'absolute' as const,
      top: '20px',
      left: '20px',
      right: '-20px',
      bottom: '-20px',
      border: '2px solid #CCFF00',
      zIndex: -1,
    },
    contentBox: {
      paddingRight: '20px',
    },
    tagline: {
      fontSize: '0.8rem',
      letterSpacing: '4px',
      textTransform: 'uppercase' as const,
      color: '#CCFF00',
      fontWeight: 600,
      display: 'block',
      marginBottom: '15px',
    },
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '3.5rem',
      margin: '0 0 30px 0',
      fontWeight: 400,
      lineHeight: 1.1,
      color: '#333333',
    },
    p: {
      fontSize: '1.05rem',
      marginBottom: '25px',
      color: '#555555',
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-word' as const,
    },
    highlightBox: {
      borderLeft: '4px solid #CCFF00',
      paddingLeft: '20px',
      fontStyle: 'italic' as const,
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.2rem',
      margin: '40px 0',
      color: '#333333',
    },
    button: {
      display: 'inline-block',
      backgroundColor: '#CCFF00',
      color: '#333333',
      padding: '18px 45px',
      textDecoration: 'none',
      letterSpacing: '2px',
      fontSize: '0.9rem',
      fontWeight: 600,
      transition: 'all 0.4s',
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 4px 15px rgba(255, 179, 217, 0.3)',
    } as React.CSSProperties,
    buttonHover: {
      backgroundColor: '#E91E63',
      transform: 'translateY(-3px)',
    },
  }

  const handleBooking = () => {
    router.push('/booking')
  }

  return (
    <>
      <Navbar />
      <main style={styles.root}>
        <section style={styles.wrapper}>
          <div style={styles.imageContainer}>
            <img
              src="tu-foto-profesional.jpg"
              alt="Luz Catalá Cosmiatra"
              style={styles.image}
              onError={(e) => {
                e.currentTarget.style.opacity = '0.5'
              }}
            />
          </div>

          <div style={styles.contentBox}>
            <span style={styles.tagline}>Ciencia · Estética · Bienestar</span>
            <h1 style={styles.h1}>Luz Catalá</h1>

            <p style={styles.p}>
              Como <strong>Cosmiatra y Especialista en Bienestar</strong>, entiendo que la piel no es solo nuestra
              carta de presentación, sino un órgano vivo que merece un respeto absoluto. Mi enfoque combina la
              precisión técnica con una experiencia sensorial profunda.
            </p>

            <div style={styles.highlightBox}>
              "Mi misión es revelar la belleza que ya existe en ti, potenciándola a través de la salud cutánea y la
              armonía facial."
            </div>

            <p style={styles.p}>
              <strong>Lográ tus mejores pestañas</strong>, aplicando técnicas
              de curvatura y nutrición que logran un efecto de apertura y sofisticación orgánica, respetando siempre
              la integridad de la pestaña natural.
            </p>

            <p style={styles.p}>
              En <strong>Catalea Beauty Center</strong>, transformamos el cuidado personal en un ritual de renovación.
              Aca, cada tratamiento es un diagnóstico personalizado y cada masaje es una desconexión necesaria del
              mundo exterior.
            </p>

            <button
              style={styles.button}
              onClick={handleBooking}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFB3D9'
                e.currentTarget.style.color = '#333333'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#CCFF00'
                e.currentTarget.style.color = '#333333'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Agendar Turno
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
