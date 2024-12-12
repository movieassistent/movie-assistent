import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Alle Felder müssen ausgefüllt werden' },
        { status: 400 }
      )
    }

    // Check if email exists
    const existingEmail = await prisma.email.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Diese E-Mail-Adresse wird bereits verwendet' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user and email in transaction
    const user = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
        },
      })

      await prisma.email.create({
        data: {
          email,
          userId: user.id,
          primary: true,
        },
      })

      return user
    })

    return NextResponse.json(
      { message: 'Benutzer erfolgreich erstellt' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
} 