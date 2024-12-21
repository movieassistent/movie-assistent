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

    if (!user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 })
    }

    // Superadmin sieht alle Ideen
    if (user.role === 'SUPERADMIN') {
      const ideas = await prisma.appIdea.findMany({
        orderBy: [
          { order: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          createdBy: {
            select: {
              name: true,
              emails: {
                where: { primary: true },
                select: { email: true }
              }
            }
          },
          subtasks: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })
      return NextResponse.json(ideas)
    }

    // Normale User sehen nur ihre eigenen und öffentliche Ideen
    const ideas = await prisma.appIdea.findMany({
      where: {
        OR: [
          { createdById: user.id },
          { visibility: 'PUBLIC' }
        ]
      },
      orderBy: [
        { order: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Fehler beim Laden der Entwicklungsideen:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Entwicklungsideen' },
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

    // Validiere die Priorit��t
    if (data.priority < 1 || data.priority > 5) {
      return NextResponse.json({ error: 'Ungültige Priorität (1-5)' }, { status: 400 })
    }

    // Hole die aktuelle höchste Ordnungszahl
    const maxOrder = await prisma.appIdea.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const idea = await prisma.appIdea.create({
      data: {
        ...data,
        status: 'SUBMITTED',
        createdById: user.id,
        order: (maxOrder?.order ?? -1) + 1
      }
    })

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Fehler beim Erstellen der Entwicklungsidee:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Entwicklungsidee' },
      { status: 500 }
    )
  }
} 