import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const feature = await prisma.appIdea.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(data.status === 'IMPLEMENTED' ? { implementedAt: new Date() } : {})
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
      { error: 'Fehler beim Aktualisieren des Features' },
      { status: 500 }
    )
  }
} 