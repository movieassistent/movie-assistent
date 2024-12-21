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
      }
    })

    if (user?.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const features = await prisma.appIdea.findMany({
      orderBy: [
        { order: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(features)
  } catch (error) {
    console.error('Fehler beim Laden der Features:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Features' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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

    const data = await request.json()
    
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'DONE']
    if (data.priority && !validPriorities.includes(data.priority)) {
      return NextResponse.json({ error: 'Ungültige Priorität' }, { status: 400 })
    }

    const maxOrder = await prisma.appIdea.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const feature = await prisma.appIdea.create({
      data: {
        ...data,
        createdById: user.id,
        order: (maxOrder?.order ?? -1) + 1
      }
    })

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Fehler beim Erstellen des Features:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Features' },
      { status: 500 }
    )
  }
} 