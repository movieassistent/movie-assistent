import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const features = await prisma.appIdea.findMany({
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

    return NextResponse.json(features)
  } catch (error) {
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
    const feature = await prisma.appIdea.create({
      data: {
        ...data,
        createdById: user.id
      },
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

    return NextResponse.json(feature)
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Features' },
      { status: 500 }
    )
  }
} 