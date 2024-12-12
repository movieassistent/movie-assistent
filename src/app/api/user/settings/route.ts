import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { UserSettings } from '@/types/settings'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    if (!settings) {
      // Erstelle Standardeinstellungen, wenn keine existieren
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          theme: 'movie',
          sidebarPosition: 'left',
          sidebarCollapsed: false,
          startPage: 'dashboard',
          lastVisitedPath: '/dashboard',
          testMode: false
        }
      })
      return NextResponse.json({ data: defaultSettings })
    }

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Validiere die eingehenden Daten
    const validData: Partial<UserSettings> = {}

    // Validiere lastVisitedPath zuerst, da es unabhängig ist
    if (data.lastVisitedPath && 
        !data.lastVisitedPath.includes('/auth') && 
        !data.lastVisitedPath.includes('/api') && 
        data.lastVisitedPath !== '/') {
      validData.lastVisitedPath = data.lastVisitedPath
    }

    if (data.theme && ['movie', 'dark', 'light'].includes(data.theme)) {
      validData.theme = data.theme
    }

    if (data.sidebarPosition && ['left', 'right', 'top', 'bottom'].includes(data.sidebarPosition)) {
      validData.sidebarPosition = data.sidebarPosition
    }

    if (typeof data.sidebarCollapsed === 'boolean') {
      validData.sidebarCollapsed = data.sidebarCollapsed
    }

    if (data.startPage && ['dashboard', 'lastVisited'].includes(data.startPage)) {
      validData.startPage = data.startPage
    }

    if (typeof data.testMode === 'boolean') {
      validData.testMode = data.testMode
    }

    console.log('Received settings update:', data)
    console.log('Validated settings:', validData)

    if (Object.keys(validData).length === 0) {
      return NextResponse.json({ error: 'No valid data provided' }, { status: 400 })
    }

    // Hole die aktuellen Einstellungen
    const currentSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    // Wenn keine Einstellungen existieren, erstelle sie mit den Standardwerten
    if (!currentSettings) {
      const newSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          theme: 'movie',
          sidebarPosition: data.sidebarPosition || 'left',
          sidebarCollapsed: data.sidebarCollapsed ?? false,
          startPage: data.startPage || 'dashboard',
          lastVisitedPath: data.lastVisitedPath || '/dashboard',
          testMode: data.testMode ?? false
        }
      })
      return NextResponse.json({ data: newSettings })
    }

    // Aktualisiere nur die geänderten Felder
    const updatedSettings = await prisma.userSettings.update({
      where: { userId: session.user.id },
      data: validData
    })

    return NextResponse.json({ data: updatedSettings })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export { PATCH as PUT }