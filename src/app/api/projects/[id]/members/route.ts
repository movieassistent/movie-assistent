import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProjectRole } from '@prisma/client'

// Mitglieder eines Projekts abrufen
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const members = await prisma.projectMember.findMany({
      where: {
        projectId: params.id
      },
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
    })

    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Laden der Mitglieder' },
      { status: 500 }
    )
  }
}

// Neues Mitglied einladen
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { email, role = ProjectRole.MEMBER } = await request.json()

    // Prüfe ob der einladende User Owner oder Admin ist
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id,
                role: ProjectRole.ADMIN
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Keine Berechtigung' },
        { status: 403 }
      )
    }

    // Finde den einzuladenden User
    const invitedUser = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email
          }
        }
      }
    })

    if (!invitedUser) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    // Füge Mitglied hinzu
    const member = await prisma.projectMember.create({
      data: {
        projectId: params.id,
        userId: invitedUser.id,
        role
      },
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
    })

    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Hinzufügen des Mitglieds' },
      { status: 500 }
    )
  }
} 