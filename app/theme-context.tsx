'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  if (!mounted) {
    return children
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const themeColors = {
  light: {
    background: '#FFF5F5',
    foreground: '#403B38',
    accent: '#CDA291',
    light: '#FFFFFF',
    secondary: '#FFF9F7',
    border: '#E8D4CC',
    hover: '#B88E7D',
  },
  dark: {
    background: '#2A2520',
    foreground: '#F5F1ED',
    accent: '#D4A896',
    light: '#3D3530',
    secondary: '#332D28',
    border: '#4A4238',
    hover: '#E8BA9E',
  },
}
