import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse(null, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { emails: true }
    })

    if (!user) {
      return new NextResponse(null, { status: 404 })
    }

    // Update Name
    if (name && name !== user.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name }
      })
    }

    // Update Email
    if (email && email !== user.emails[0]?.email) {
      await prisma.email.update({
        where: { id: user.emails[0].id },
        data: { email }
      })
    }

    // Update Password
    if (currentPassword && newPassword) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) {
        return new NextResponse(
          JSON.stringify({ error: 'Aktuelles Passwort ist falsch' }), 
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return new NextResponse(null, { status: 500 })
  }
} 