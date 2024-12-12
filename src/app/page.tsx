'use client'

import { useState } from 'react'
import { Header } from '../components/landing/Header'
import { HeroSection } from '../components/landing/HeroSection'
import { FeatureSection } from '../components/landing/FeatureSection'
import { Footer } from '../components/landing/Footer'
import AuthModal from '../components/auth/AuthModal'

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleSwitchToRegister = () => {
    setShowLoginModal(false)
    setTimeout(() => {
      setShowRegisterModal(true)
    }, 100)
  }

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false)
    setTimeout(() => {
      setShowLoginModal(true)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
      />
      <HeroSection />
      <FeatureSection />
      <Footer />

      <AuthModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialView="login"
        onSwitchToRegister={handleSwitchToRegister}
      />
      <AuthModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        initialView="register"
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  )
}