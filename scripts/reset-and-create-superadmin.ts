import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

async function resetAndCreateSuperAdmin() {
  try {
    console.log('Lösche alte Daten...')
    
    // Lösche alle existierenden Emails und User
    await prisma.email.deleteMany({})
    await prisma.user.deleteMany({})
    
    console.log('Erstelle neuen SuperAdmin...')
    
    // Hash das Passwort
    const hashedPassword = await hash('MovieAdmin123!', 12)

    // Erstelle SuperAdmin und Email in einer Transaktion
    const superAdmin = await prisma.$transaction(async (prisma) => {
      // Erstelle den User
      const user = await prisma.user.create({
        data: {
          name: 'SuperAdmin',
          password: hashedPassword,
          role: 'SUPERADMIN',
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

    console.log('SuperAdmin wurde erfolgreich erstellt!')
    console.log('Email: admin@movieassistent.com')
    console.log('Passwort: MovieAdmin123!')
    console.log('Rolle: SUPERADMIN')

  } catch (error) {
    console.error('Fehler beim Erstellen des SuperAdmin:', error)
    process.exit(1)
  }
}

resetAndCreateSuperAdmin() 