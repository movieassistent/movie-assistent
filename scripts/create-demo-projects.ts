import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Finde den Admin-User
    const adminUser = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: 'admin@movie-web.dev'
          }
        }
      }
    })

    if (!adminUser) {
      throw new Error('Admin User nicht gefunden')
    }

    // Erstelle Demo-Projekte
    const projects = [
      {
        name: 'Movie Web App',
        description: 'Eine Webanwendung zur Verwaltung von Filmen und Serien',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        genre: 'Web Development',
        status: 'ACTIVE',
        ownerId: adminUser.id
      },
      {
        name: 'Streaming Platform',
        description: 'Eine Streaming-Plattform für Filme und Serien',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-12-31'),
        genre: 'Web Development',
        status: 'IN_PLANNING',
        ownerId: adminUser.id
      },
      {
        name: 'Movie Database',
        description: 'Eine Datenbank für Filme und Serien',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-12-31'),
        genre: 'Database',
        status: 'IN_PLANNING',
        ownerId: adminUser.id
      }
    ]

    for (const project of projects) {
      await prisma.project.create({
        data: project
      })
    }

    console.log('Demo-Projekte wurden erfolgreich erstellt')
  } catch (error) {
    console.error('Fehler beim Erstellen der Demo-Projekte:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 