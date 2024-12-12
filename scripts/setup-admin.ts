import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Admin-Benutzer erstellen
    const hashedPassword = await bcrypt.hash('MovieAdmin123!', 10)
    
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
        emails: {
          create: {
            email: 'admin@movieassistent.com',
            verified: true,
            primary: true
          }
        },
        settings: {
          create: {
            theme: 'movie assistent',
            sidebarPosition: 'links',
            startPage: 'dashboard',
            notifications: {
              email: false,
              push: false
            }
          }
        }
      }
    })

    console.log('Admin-Benutzer wurde erfolgreich erstellt')
  } catch (error) {
    console.error('Fehler beim Erstellen des Admin-Benutzers:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
