import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'

async function resetUsers() {
  try {
    // Lösche alle existierenden Benutzer
    await prisma.email.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('Alle Benutzer wurden gelöscht')

    // Erstelle den SuperAdmin
    const superAdminPassword = await hash('MovieAdmin123!', 12)
    const superAdmin = await prisma.user.create({
      data: {
        name: 'SuperAdmin',
        password: superAdminPassword,
        role: 'SUPERADMIN',
        emails: {
          create: {
            email: 'admin@movieassistent.com',
            primary: true,
            verified: true
          }
        }
      }
    })

    console.log('SuperAdmin wurde erfolgreich erstellt:', {
      id: superAdmin.id,
      name: superAdmin.name,
      role: superAdmin.role,
      email: 'admin@movieassistent.com'
    })

    // Erstelle den Demo User
    const demoPassword = await hash('demo123', 12)
    const demoUser = await prisma.user.create({
      data: {
        name: 'Demo User',
        password: demoPassword,
        role: 'USER',
        emails: {
          create: {
            email: 'demo@example.com',
            primary: true,
            verified: true
          }
        }
      }
    })

    console.log('Demo User wurde erfolgreich erstellt:', {
      id: demoUser.id,
      name: demoUser.name,
      role: demoUser.role,
      email: 'demo@example.com'
    })

  } catch (error) {
    console.error('Fehler beim Zurücksetzen der Benutzer:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetUsers() 