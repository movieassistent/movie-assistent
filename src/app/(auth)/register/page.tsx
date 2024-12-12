'use client'

import { useLanguage } from '@/app/components/LanguageProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const content = {
    de: {
      title: "Konto erstellen",
      subtitle: "Starten Sie Ihre Filmproduktion",
      nameLabel: "Name",
      emailLabel: "E-Mail Adresse",
      passwordLabel: "Passwort",
      confirmPasswordLabel: "Passwort bestätigen",
      registerButton: "Registrieren",
      loginLink: "Bereits registriert? Anmelden"
    },
    en: {
      title: "Create Account",
      subtitle: "Start your film production",
      nameLabel: "Name",
      emailLabel: "Email address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm password",
      registerButton: "Register",
      loginLink: "Already registered? Sign in"
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const name = formData.get('name') as string

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        router.push('/auth/login')
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#1A1A1A] rounded-xl border border-[#C6A55C]/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            <span className="text-gold-gradient">
              {content[language].title}
            </span>
          </h2>
          <p className="mt-2 text-gray-400">
            {content[language].subtitle}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#C6A55C]">
                {content[language].nameLabel}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-4 py-2 bg-[#0A0A0A] border border-[#222222] rounded-lg text-white focus:border-[#C6A55C] focus:ring-1 focus:ring-[#C6A55C] transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#C6A55C]">
                {content[language].emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-2 bg-[#0A0A0A] border border-[#222222] rounded-lg text-white focus:border-[#C6A55C] focus:ring-1 focus:ring-[#C6A55C] transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#C6A55C]">
                {content[language].passwordLabel}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-2 bg-[#0A0A0A] border border-[#222222] rounded-lg text-white focus:border-[#C6A55C] focus:ring-1 focus:ring-[#C6A55C] transition"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#C6A55C]">
                {content[language].confirmPasswordLabel}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-4 py-2 bg-[#0A0A0A] border border-[#222222] rounded-lg text-white focus:border-[#C6A55C] focus:ring-1 focus:ring-[#C6A55C] transition"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-black bg-gradient-to-r from-[#C6A55C] to-[#E9D5A0] hover:from-[#D4B56A] hover:to-[#F7E3AE] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C6A55C] transition-colors"
            >
              {isLoading ? 'Wird geladen...' : content[language].registerButton}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/auth/login" 
              className="text-sm text-gray-400 hover:text-[#C6A55C] transition-colors"
            >
              {content[language].loginLink}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 