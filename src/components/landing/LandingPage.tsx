'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Header } from './Header'
import { HeroSection } from './HeroSection'
import { FeatureSection } from './FeatureSection'
import { Footer } from './Footer'
import { SettingsProvider } from '@/providers/SettingsProvider'

// Dynamischer Import des AuthModal mit Loading-Fallback
const AuthModal = dynamic(() => import('../auth/AuthModal'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C6A55C]" />
    </div>
  ),
})

interface LandingPageProps {
  initialShowLogin?: boolean
}

export default function LandingPage({ initialShowLogin = false }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(initialShowLogin)
  const [authView, setAuthView] = useState<'login' | 'register'>('login')

  const handleLoginClick = () => {
    setAuthView('login')
    setShowAuthModal(true)
  }

  const handleRegisterClick = () => {
    setAuthView('register')
    setShowAuthModal(true)
  }

  const handleSwitchToRegister = () => {
    setAuthView('register')
  }

  const handleSwitchToLogin = () => {
    setAuthView('login')
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header 
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <HeroSection />
      <FeatureSection />
      <Footer />
      
      {showAuthModal && (
        <SettingsProvider>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialView={authView}
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </SettingsProvider>
      )}
    </div>
  )
}
