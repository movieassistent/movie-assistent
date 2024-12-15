'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onSwitchToRegister?: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Ungültige Anmeldedaten')
        return
      }

      // Nach erfolgreichem Login zur Dashboard-Route
      // Die Weiterleitung zur richtigen Startseite erfolgt dann im AuthenticatedLayout
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setError('Ein Fehler ist aufgetreten')
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
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-[#C6A55C] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#C6A55C]/90 focus:outline-none focus:ring-2 focus:ring-[#C6A55C]/50 disabled:opacity-50"
      >
        Anmelden
      </button>
      <div className="text-center text-sm text-gray-400">
        Noch kein Konto?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[#C6A55C] hover:text-[#E9D5A0] transition-colors"
        >
          Jetzt registrieren
        </button>
      </div>
    </form>
  )
}
