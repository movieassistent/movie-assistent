import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
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
      },
      select: {
        lastVisitedPath: true
      }
    })

    return NextResponse.json({ lastVisitedPath: user?.lastVisitedPath || null })
  } catch (error) {
    console.error('Fehler beim Laden des letzten Besuchs:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden des letzten Besuchs' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { path } = await request.json()
    if (!path) {
      return NextResponse.json({ error: 'Kein Pfad angegeben' }, { status: 400 })
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

    await prisma.user.update({
      where: { id: user.id },
      data: { lastVisitedPath: path }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Speichern des letzten Besuchs:', error)
    return NextResponse.json(
      { error: 'Fehler beim Speichern des letzten Besuchs' },
      { status: 500 }
    )
  }
} 