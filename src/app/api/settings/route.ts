import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const emailRecord = await prisma.email.findFirst({
      where: {
        email: session.user.email,
        verified: true
      },
      include: {
        user: {
          include: {
            settings: true
          }
        }
      }
    })

    if (!emailRecord?.user?.settings) {
      return NextResponse.json({
        theme: 'movie assistent',
        sidebarPosition: 'links',
        startPage: 'dashboard',
        notifications: {
          email: false,
          push: false
        }
      })
    }

    return NextResponse.json(emailRecord.user.settings)
  } catch (error) {
    console.error('Fehler beim Laden der Einstellungen:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const emailRecord = await prisma.email.findFirst({
      where: {
        email: session.user.email,
        verified: true
      },
      include: {
        user: true
      }
    })

    if (!emailRecord?.user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const settings = await prisma.userSettings.upsert({
      where: {
        userId: emailRecord.user.id
      },
      update: {
        theme: data.theme || 'Movie Assistent',
        sidebarPosition: data.sidebarPosition || 'links',
        startPage: data.startPage || 'dashboard',
        notifications: data.notifications || { email: false, push: false }
      },
      create: {
        userId: emailRecord.user.id,
        theme: data.theme || 'Movie Assistent',
        sidebarPosition: data.sidebarPosition || 'links',
        startPage: data.startPage || 'dashboard',
        notifications: data.notifications || { email: false, push: false }
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Fehler beim Speichern der Einstellungen:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
