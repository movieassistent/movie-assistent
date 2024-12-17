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

    // Prüfe ob User SuperAdmin ist
    const user = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: session.user.email
          }
        }
      }
    })

    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const ideas = await prisma.appIdea.findMany({
      orderBy: [
        { status: 'asc' },
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
        }
      }
    })

    return NextResponse.json(ideas)
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Laden der App-Ideen' },
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

    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const data = await request.json()
    const idea = await prisma.appIdea.create({
      data: {
        ...data,
        createdById: user.id
      }
    })

    return NextResponse.json(idea)
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der App-Idee' },
      { status: 500 }
    )
  }
} 