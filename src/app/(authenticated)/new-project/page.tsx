'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    genre: 'spielfilm'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API-Call zum Erstellen eines neuen Projekts
    router.push('/projects')
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="heading-container mb-8">
        <h1 className="page-heading text-2xl font-bold text-white">
          Neues Projekt erstellen
        </h1>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#C6A55C]">
              Projekttitel
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md bg-[#111111] border border-[#C6A55C]/20 text-white focus:outline-none focus:ring-1 focus:ring-[#C6A55C] focus:border-[#C6A55C] sm:text-sm px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#C6A55C]">
              Beschreibung
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md bg-[#111111] border border-[#C6A55C]/20 text-white focus:outline-none focus:ring-1 focus:ring-[#C6A55C] focus:border-[#C6A55C] sm:text-sm px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-[#C6A55C]">
                Startdatum
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md bg-[#111111] border border-[#C6A55C]/20 text-white focus:outline-none focus:ring-1 focus:ring-[#C6A55C] focus:border-[#C6A55C] sm:text-sm px-3 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-[#C6A55C]">
                Enddatum
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md bg-[#111111] border border-[#C6A55C]/20 text-white focus:outline-none focus:ring-1 focus:ring-[#C6A55C] focus:border-[#C6A55C] sm:text-sm px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-[#C6A55C]">
              Genre
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="mt-1 block w-full rounded-md bg-[#111111] border border-[#C6A55C]/20 text-white focus:outline-none focus:ring-1 focus:ring-[#C6A55C] focus:border-[#C6A55C] sm:text-sm px-3 py-2"
            >
              <option value="spielfilm">Spielfilm</option>
              <option value="dokumentation">Dokumentation</option>
              <option value="kurzfilm">Kurzfilm</option>
              <option value="serie">Serie</option>
              <option value="werbung">Werbung</option>
              <option value="musikvideo">Musikvideo</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#111111] hover:bg-[#222222] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C6A55C]"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-[#C6A55C] via-[#E9D5A0] to-[#C6A55C] rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C6A55C]"
            >
              Projekt erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}