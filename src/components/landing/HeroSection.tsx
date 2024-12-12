'use client'

import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  return (
    <div className="relative isolate min-h-[calc(80vh+100px)] flex items-center overflow-hidden bg-[#141414] border-b border-[#C6A55C]">
      {/* Background Logo */}
      <div className="absolute inset-0 overflow-hidden opacity-10" style={{ 
        height: 'calc(100% + 100px)',
        transform: 'translateY(-100px)',
      }}>
        <Image
          src="/images/color_logo.svg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold tracking-tight mb-6 whitespace-pre-line">
            <span className="text-gold-gradient">
              Professionelles Film
              Produktions Management
            </span>
          </h1>
          <p className="text-xl text-gold-gradient mb-10 opacity-90">
            Optimieren Sie Ihren Filmproduktions-Workflow mit unserer umfassenden Management-Plattform. 
            Vom Drehbuch bis zur Leinwand - wir unterstützen Sie.
          </p>
          <div className="flex gap-4">
            <Link
              href="/new-project"
              className="btn-primary w-64 h-12 flex items-center justify-center"
            >
              Projekt Starten
            </Link>
            <Link
              href="/tour"
              className="btn-secondary w-64 h-12 flex items-center justify-center"
            >
              Starte Tour
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
