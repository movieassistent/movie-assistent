import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateThemes() {
  try {
    await prisma.userSettings.updateMany({
      where: {
        theme: 'Movie Assistent'
      },
      data: {
        theme: 'movie assistent'
      }
    })
    console.log('Themes wurden erfolgreich aktualisiert')
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Themes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateThemes()
