import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

// Logger-Funktion
function logToFile(message: string) {
  try {
    // Expliziter Pfad zum Projektverzeichnis
    const logPath = path.join(process.cwd(), 'logs', 'settings.log')
    
    // Stelle sicher, dass das Verzeichnis existiert
    const dir = path.dirname(logPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    const timestamp = new Date().toISOString()
    const logMessage = `${timestamp}: ${message}\n`
    
    // Synchrones Schreiben mit Fehlerbehandlung
    fs.appendFileSync(logPath, logMessage)
    console.log('Log written to:', logPath) // Zeigt uns, wo die Datei erstellt wird
  } catch (error) {
    console.error('Logging failed:', error)
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const user = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: session.user.email
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 })
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    })

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Interner Server Fehler' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const data = await request.json()
    const user = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: session.user.email
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 })
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        sidebarPosition: 'links',
        sidebarCollapsed: false,
        startPage: 'dashboard',
        lastVisitedPath: '/dashboard',
        theme: 'dark',
        language: 'de',
        ...data
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Interner Server Fehler' }, { status: 500 })
  }
}