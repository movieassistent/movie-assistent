import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { ideaId, newIndex } = await request.json()

    // Hole alle Ideen in der aktuellen Reihenfolge
    const ideas = await prisma.appIdea.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Finde die zu verschiebende Idee
    const ideaIndex = ideas.findIndex(i => i.id === ideaId)
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idee nicht gefunden' }, { status: 404 })
    }

    // Berechne die neue Reihenfolge
    const idea = ideas[ideaIndex]
    ideas.splice(ideaIndex, 1)
    ideas.splice(newIndex, 0, idea)

    // Aktualisiere die Reihenfolge in der Datenbank
    await Promise.all(
      ideas.map((idea, index) =>
        prisma.appIdea.update({
          where: { id: idea.id },
          data: { order: index }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Neuordnen der Ideen:', error)
    return NextResponse.json(
      { error: 'Fehler beim Neuordnen der Ideen' },
      { status: 500 }
    )
  }
} 