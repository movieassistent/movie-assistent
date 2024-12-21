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

    const { featureId, newIndex } = await request.json()

    // Hole alle Features in der aktuellen Reihenfolge
    const features = await prisma.appIdea.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Finde das zu verschiebende Feature
    const featureIndex = features.findIndex(f => f.id === featureId)
    if (featureIndex === -1) {
      return NextResponse.json({ error: 'Feature nicht gefunden' }, { status: 404 })
    }

    // Berechne die neue Reihenfolge
    const feature = features[featureIndex]
    features.splice(featureIndex, 1)
    features.splice(newIndex, 0, feature)

    // Aktualisiere die Reihenfolge in der Datenbank
    await Promise.all(
      features.map((feature, index) =>
        prisma.appIdea.update({
          where: { id: feature.id },
          data: { order: index }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Neuordnen der Features:', error)
    return NextResponse.json(
      { error: 'Fehler beim Neuordnen der Features' },
      { status: 500 }
    )
  }
} 