'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'movie' | 'dark' | 'light' | 'gray'

type ThemeColors = {
  background: string
  surface: string
  primary: string
  primaryHover: string
  text: string
  textSecondary: string
  border: string
}

const themes: Record<Theme, ThemeColors> = {
  movie: {
    background: '#141414',
    surface: '#1A1A1A',
    primary: '#C6A55C',
    primaryHover: '#E9D5A0',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: 'rgba(198, 165, 92, 0.2)'
  },
  dark: {
    background: '#000000',
    surface: '#0A0A0A',
    primary: '#404040',
    primaryHover: '#525252',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: 'rgba(64, 64, 64, 0.2)'
  },
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#404040',
    primaryHover: '#525252',
    text: '#000000',
    textSecondary: '#4B5563',
    border: 'rgba(64, 64, 64, 0.2)'
  },
  gray: {
    background: '#1F2937',
    surface: '#374151',
    primary: '#6B7280',
    primaryHover: '#9CA3AF',
    text: '#FFFFFF',
    textSecondary: '#D1D5DB',
    border: 'rgba(107, 114, 128, 0.2)'
  }
}

const ThemeContext = createContext<{
  theme: Theme
  colors: ThemeColors
  setTheme: (theme: Theme) => void
}>({
  theme: 'movie',
  colors: themes.movie,
  setTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('movie')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme)
    }
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, colors: themes[theme], setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext) 