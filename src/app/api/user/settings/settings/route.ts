'use server'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse(null, { status: 401 })
  }

  try {
    const body = await request.json()
    const settings = await prisma.userSettings.update({
      where: { userId: session.user.id },
      data: body
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return new NextResponse(null, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse(null, { status: 401 })
  }

  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return new NextResponse(null, { status: 500 })
  }
}
