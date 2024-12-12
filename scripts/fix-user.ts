import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixUser() {
  try {
    // Finde den Admin-Benutzer
    const emailRecord = await prisma.email.findFirst({
      where: {
        email: 'admin@movieassistent.com'
      },
      include: {
        user: true
      }
    })

    if (!emailRecord?.user) {
      console.error('Admin-Benutzer nicht gefunden')
      return
    }

    // Setze die korrekten Einstellungen
    await prisma.userSettings.upsert({
      where: { userId: emailRecord.user.id },
      create: {
        userId: emailRecord.user.id,
        theme: 'movie assistent',
        sidebarPosition: 'links',
        startPage: 'dashboard',
        notifications: {
          email: false,
          push: false
        }
      },
      update: {
        theme: 'movie assistent',
        sidebarPosition: 'links',
        startPage: 'dashboard',
        notifications: {
          email: false,
          push: false
        }
      }
    })

    console.log('Benutzereinstellungen wurden erfolgreich aktualisiert')
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Benutzereinstellungen:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUser()
