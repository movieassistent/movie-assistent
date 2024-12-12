'use client'

import { Calendar, Film, Users, Clock, FileText, Bell } from 'lucide-react'

const features = [
  {
    name: 'Projektmanagement',
    description: 'Verwalten Sie alle Ihre Filmprojekte an einem zentralen Ort.',
    icon: Film,
  },
  {
    name: 'Terminplanung',
    description: 'Behalten Sie den Überblick über Drehtage und wichtige Termine.',
    icon: Calendar,
  },
  {
    name: 'Cast & Crew',
    description: 'Organisieren Sie Ihr Team und verwalten Sie Kontakte effizient.',
    icon: Users,
  },
  {
    name: 'Drehbücher',
    description: 'Arbeiten Sie gemeinsam an Drehbüchern und verfolgen Sie Änderungen.',
    icon: FileText,
  },
  {
    name: 'Zeitplanung',
    description: 'Erstellen und verwalten Sie detaillierte Drehpläne.',
    icon: Clock,
  },
  {
    name: 'Benachrichtigungen',
    description: 'Bleiben Sie über alle wichtigen Änderungen informiert.',
    icon: Bell,
  },
]

export function FeatureSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#C6A55C] mb-4">
            Alles was Sie brauchen
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Unser Assistent bietet Ihnen alle wichtigen Funktionen für eine erfolgreiche Filmproduktion.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="p-6 rounded-xl bg-[#1A1A1A] border border-[#C6A55C]/20 hover:border-[#C6A55C]/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-[#C6A55C]/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#C6A55C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#C6A55C] mb-2">{feature.name}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
