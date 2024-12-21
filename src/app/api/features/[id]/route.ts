import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function checkSuperAdminAccess(email: string | null | undefined) {
  if (!email) {
    return false
  }

  const user = await prisma.user.findFirst({
    where: {
      emails: {
        some: {
          email: email
        }
      }
    }
  })

  return user?.role === 'SUPERADMIN'
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const isSuperAdmin = await checkSuperAdminAccess(session.user.email)
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const data = await request.json()
    const feature = await prisma.appIdea.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        implementedAt: data.status === 'IMPLEMENTED' ? new Date() : null
      }
    })

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Features:', error)
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Features' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const isSuperAdmin = await checkSuperAdminAccess(session.user.email)
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    await prisma.appIdea.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Löschen des Features:', error)
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Features' },
      { status: 500 }
    )
  }
} 