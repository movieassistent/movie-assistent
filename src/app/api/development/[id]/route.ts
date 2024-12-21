import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Keine ID angegeben' }, { status: 400 })
    }

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

    const idea = await prisma.appIdea.findUnique({
      where: { id },
      include: {
        subtasks: true
      }
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idee nicht gefunden' }, { status: 404 })
    }

    // Nur der Ersteller oder ein Admin/Superadmin darf die Idee bearbeiten
    if (idea.createdById !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const data = await request.json()

    // Wenn der Status auf DONE gesetzt wird, setze implementedAt
    const implementedAt = data.status === 'DONE' && idea.status !== 'DONE'
      ? new Date()
      : data.status !== 'DONE' ? null : idea.implementedAt

    const updateData = {
      title: data.title || idea.title,
      description: data.description || idea.description,
      status: data.status || idea.status,
      priority: data.priority || idea.priority,
      visibility: data.visibility || idea.visibility,
      category: data.category,
      implementedAt,
      progress: data.progress,
      subtasks: {
        deleteMany: {},
        createMany: {
          data: data.subtasks.map((subtask: any) => ({
            title: subtask.title,
            description: subtask.description,
            aiPrompt: subtask.aiPrompt,
            completed: subtask.completed,
            order: subtask.order,
            isAiGenerated: subtask.isAiGenerated
          }))
        }
      }
    }

    const updatedIdea = await prisma.appIdea.update({
      where: { id },
      data: updateData,
      include: {
        subtasks: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fehler beim Aktualisieren der Entwicklungsidee:', error.message)
      return NextResponse.json({ 
        error: `Fehler beim Aktualisieren der Entwicklungsidee: ${error.message}` 
      }, { status: 500 })
    }
    return NextResponse.json({ 
      error: 'Unbekannter Fehler beim Aktualisieren der Entwicklungsidee' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Keine ID angegeben' }, { status: 400 })
    }

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

    const idea = await prisma.appIdea.findUnique({
      where: { id: id }
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idee nicht gefunden' }, { status: 404 })
    }

    // Nur der Ersteller oder ein Admin/Superadmin darf die Idee löschen
    if (idea.createdById !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    await prisma.appIdea.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Löschen der Entwicklungsidee:', error)
    return NextResponse.json(
      { error: 'Fehler beim Löschen der Entwicklungsidee' },
      { status: 500 }
    )
  }
} 