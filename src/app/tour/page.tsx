import Link from 'next/link'
import { Header } from '../../components/landing/Header'
import { Footer } from '../../components/landing/Footer'

export default function TourPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#C6A55C] sm:text-6xl">
            Produkttour
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Entdecken Sie die Funktionen und Möglichkeiten unserer Plattform.
          </p>
        </div>

        <div className="mt-16">
          <Link
            href="/"
            className="text-[#C6A55C] hover:text-[#E9D5A0] transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}