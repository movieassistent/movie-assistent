'use client'

import { createContext, useContext, useState } from 'react'

type AuthType = 'login' | 'register'

interface AuthModalContextType {
  showModal: boolean
  authType: AuthType
  setShowModal: (show: boolean) => void
  setAuthType: (type: AuthType) => void
}

const AuthModalContext = createContext<AuthModalContextType>({
  showModal: false,
  authType: 'login',
  setShowModal: () => {},
  setAuthType: () => {},
})

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false)
  const [authType, setAuthType] = useState<AuthType>('login')

  return (
    <AuthModalContext.Provider
      value={{
        showModal,
        authType,
        setShowModal,
        setAuthType,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => useContext(AuthModalContext)
