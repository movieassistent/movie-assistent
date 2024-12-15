'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamischer Import der LandingPage
const LandingPage = dynamic(() => import('@/components/landing/LandingPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C6A55C]" />
    </div>
  ),
})

export default function Page() {
  const searchParams = useSearchParams()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const shouldShowLogin = searchParams.get('showLogin') === 'true'
    if (shouldShowLogin) {
      setShowLogin(true)
    }
  }, [searchParams])

  return <LandingPage initialShowLogin={showLogin} />
}