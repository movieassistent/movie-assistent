import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/')
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
        <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#85754E] via-[#C6A55C] to-[#85754E]">
          Willkommen zurück, {session.user?.name}!
        </h1>
        <p className="text-gray-400 mt-1">
          Hier ist eine Übersicht Ihrer aktuellen Projekte und Aktivitäten.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <h2 className="text-lg font-medium text-[#C6A55C] mb-4">Schnellzugriff</h2>
          <div className="space-y-2">
            <button className="w-full p-2 rounded bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] transition-colors text-left">
              Neues Projekt erstellen
            </button>
            <button className="w-full p-2 rounded bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] transition-colors text-left">
              Drehbuch hochladen
            </button>
            <button className="w-full p-2 rounded bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] transition-colors text-left">
              Team einladen
            </button>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <h2 className="text-lg font-medium text-[#C6A55C] mb-4">Aktuelle Projekte</h2>
          <div className="flex flex-col items-center justify-center h-[120px] text-gray-400">
            <p className="mb-4">Noch keine Projekte vorhanden.</p>
            <button className="px-4 py-2 rounded bg-[#C6A55C]/10 hover:bg-[#C6A55C]/20 text-[#C6A55C] transition-colors">
              Erstes Projekt erstellen
            </button>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg border border-[#C6A55C]/20 p-6">
          <h2 className="text-lg font-medium text-[#C6A55C] mb-4">Letzte Aktivitäten</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#C6A55C]">Account erstellt</span>
              <span className="text-gray-400">Gerade eben</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}