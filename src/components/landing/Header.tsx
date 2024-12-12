'use client'

import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#141414]/95 backdrop-blur-md border-b border-[#C6A55C]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 pr-[17px]" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="pl-1">
            <span className="sr-only">movie assistent</span>
            <Image
              src="/images/color_brand.svg"
              alt="Movie Assistant"
              width={202}
              height={54}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-4">
          <button
            onClick={onLoginClick}
            className="btn-secondary h-10 py-2 px-4"
          >
            <span>Anmelden</span>
          </button>
          <button
            onClick={onRegisterClick}
            className="btn-primary h-10 py-2 px-4"
          >
            <span>Registrieren</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
