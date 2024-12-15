import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { hash, compare } from 'bcrypt'
import prisma from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validierung
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Alle Felder müssen ausgefüllt sein' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Das neue Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      )
    }

    // Benutzer finden
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    // Aktuelles Passwort überprüfen
    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Aktuelles Passwort ist nicht korrekt' },
        { status: 400 }
      )
    }

    // Neues Passwort hashen und speichern
    const hashedPassword = await hash(newPassword, 10)
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: 'Passwort erfolgreich geändert' })
  } catch (error) {
    console.error('Fehler bei der Passwortänderung:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
