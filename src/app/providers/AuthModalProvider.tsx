'use client'

import { createContext, useContext, useState } from 'react'

type AuthType = 'login' | 'register'

interface AuthModalContextType {
  showModal: boolean
  setShowModal: (show: boolean) => void
  authType: AuthType
  setAuthType: (type: AuthType) => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false)
  const [authType, setAuthType] = useState<AuthType>('login')

  return (
    <AuthModalContext.Provider
      value={{
        showModal,
        setShowModal,
        authType,
        setAuthType,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}
