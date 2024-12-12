'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useAuthModal } from '@/providers/AuthModalProvider'

interface RegisterFormProps {
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setShowModal, setAuthType } = useAuthModal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein')
      setIsLoading(false)
      return
    }

    try {
      // Hier würde normalerweise die Registrierung mit der API erfolgen
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        // Nach erfolgreicher Registrierung direkt anmelden
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError('Fehler bei der automatischen Anmeldung')
        } else {
          setShowModal(false)
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Ein Fehler ist aufgetreten')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          E-Mail
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md bg-[#141414] border border-[#C6A55C]/20 text-white px-3 py-2 hover:border-[#C6A55C]"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Passwort
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md bg-[#141414] border border-[#C6A55C]/20 text-white px-3 py-2 hover:border-[#C6A55C]"
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
          Passwort bestätigen
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full rounded-md bg-[#141414] border border-[#C6A55C]/20 text-white px-3 py-2 hover:border-[#C6A55C]"
          required
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#C6A55C] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#C6A55C]/90 focus:outline-none focus:ring-2 focus:ring-[#C6A55C]/50 disabled:opacity-50"
      >
        {isLoading ? 'Wird registriert...' : 'Registrieren'}
      </button>
      <div className="text-center text-sm text-gray-400">
        Bereits ein Konto?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#C6A55C] hover:text-[#E9D5A0] transition-colors"
        >
          Jetzt anmelden
        </button>
      </div>
    </form>
  )
}
