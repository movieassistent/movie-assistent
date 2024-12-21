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

    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der API-Schlüssel' },
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
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 })
    }

    const { provider, key } = await request.json()

    if (!provider || !key) {
      return NextResponse.json(
        { error: 'Provider und API-Schlüssel sind erforderlich' },
        { status: 400 }
      )
    }

    // Validate provider
    if (!['openai', 'anthropic'].includes(provider)) {
      return NextResponse.json(
        { error: 'Ungültiger Provider' },
        { status: 400 }
      )
    }

    // Check if key format is valid based on provider
    if (provider === 'openai' && !key.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Ungültiges OpenAI API-Schlüssel Format' },
        { status: 400 }
      )
    }

    if (provider === 'anthropic' && !key.startsWith('sk-ant-')) {
      return NextResponse.json(
        { error: 'Ungültiges Anthropic API-Schlüssel Format' },
        { status: 400 }
      )
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        provider,
        key,
        userId: user.id
      }
    })

    return NextResponse.json(apiKey)
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des API-Schlüssels' },
      { status: 500 }
    )
  }
} 