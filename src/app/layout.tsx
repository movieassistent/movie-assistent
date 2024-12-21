'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { SettingsProvider } from '@/providers/SettingsProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${inter.className} h-full bg-[#141414] text-white`}>
        <SessionProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  )
}