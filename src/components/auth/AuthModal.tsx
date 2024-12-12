'use client'

import { Fragment } from 'react'
import { Dialog } from '@headlessui/react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView: 'login' | 'register'
  onSwitchToRegister?: () => void
  onSwitchToLogin?: () => void
}

export default function AuthModal({ isOpen, onClose, initialView, onSwitchToRegister, onSwitchToLogin }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <Dialog
      as="div"
      className="relative z-50"
      open={isOpen}
      onClose={onClose}
    >
      <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1A1A1A] p-6 text-left align-middle shadow-xl border border-[#C6A55C]/20">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title as="h3" className="text-lg font-medium text-[#C6A55C]">
                {initialView === 'login' ? 'Anmelden' : 'Registrieren'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {initialView === 'login' ? (
              <LoginForm onSwitchToRegister={onSwitchToRegister} />
            ) : (
              <RegisterForm onSwitchToLogin={onSwitchToLogin} />
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
