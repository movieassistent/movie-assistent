import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'

async function createSuperAdmin() {
  try {
    // Hash das Passwort
    const hashedPassword = await hash('admin', 10)

    // Erstelle den Admin-User
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        password: hashedPassword,
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

    console.log('Superadmin wurde erfolgreich erstellt:', {
      id: admin.id,
      name: admin.name,
      role: admin.role
    })

  } catch (error) {
    console.error('Fehler beim Erstellen des Superadmins:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSuperAdmin() 