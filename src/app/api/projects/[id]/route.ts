import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProjectRole } from '@prisma/client'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Finde den User
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

    // Hole das Projekt mit allen Details
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.id },
          {
            members: {
              some: {
                userId: user.id
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            name: true,
            emails: {
              where: { primary: true },
              select: { email: true }
            }
          }
        },
        members: {
          include: {
            user: {
              select: {
                name: true,
                emails: {
                  where: { primary: true },
                  select: { email: true }
                }
              }
            }
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 })
    }

    // Bestimme die Rolle des Users im Projekt
    let userRole = project.ownerId === user.id ? 'OWNER' : null
    if (!userRole) {
      const membership = project.members.find(m => m.userId === user.id)
      userRole = membership?.role || null
    }

    return NextResponse.json({
      ...project,
      userRole // Füge die Rolle des aktuellen Users hinzu
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Laden des Projekts' },
      { status: 500 }
    )
  }
} 