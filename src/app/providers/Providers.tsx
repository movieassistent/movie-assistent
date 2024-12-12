'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthModalProvider } from './AuthModalProvider'
import AuthModal from '../../components/auth/AuthModal'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        {children}
        <AuthModal />
      </AuthModalProvider>
    </SessionProvider>
  )
}
