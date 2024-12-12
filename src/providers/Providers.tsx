'use client'

import { SessionProvider } from 'next-auth/react'
import { LanguageProvider } from './LanguageProvider'
import { SettingsProvider } from './SettingsProvider'
import { ThemeProvider } from './ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <SettingsProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SettingsProvider>
      </LanguageProvider>
    </SessionProvider>
  )
}