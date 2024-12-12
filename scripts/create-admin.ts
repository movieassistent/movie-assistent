import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

async function createAdmin() {
  try {
    // Prüfe ob Admin-Email bereits existiert
    const existingEmail = await prisma.email.findUnique({
      where: { email: 'admin@movieassistent.com' }
    })

    if (existingEmail) {
      console.log('Admin-Benutzer existiert bereits.')
      return
    }

    // Hash das Passwort
    const hashedPassword = await hash('MovieAdmin123!', 12)

    // Erstelle Admin-User und Email in einer Transaktion
    const admin = await prisma.$transaction(async (prisma) => {
      // Erstelle den User
      const user = await prisma.user.create({
        data: {
          name: 'Admin',
          password: hashedPassword,
          role: 'ADMIN',
        },
      })

      // Erstelle die primäre Email
      await prisma.email.create({
        data: {
          email: 'admin@movieassistent.com',
          userId: user.id,
          primary: true,
          verified: true,
        },
      })

      return user
    })

    console.log('Admin-Benutzer wurde erfolgreich erstellt!')
    console.log('Email: admin@movieassistent.com')
    console.log('Passwort: MovieAdmin123!')

  } catch (error) {
    console.error('Fehler beim Erstellen des Admin-Users:', error)
    process.exit(1)
  }
}

createAdmin() 