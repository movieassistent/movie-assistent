import { prisma } from '@/lib/db'

async function createDemoProjects() {
  try {
    // Finde den Admin User
    const admin = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: 'admin@movieassistent.com'
          }
        }
      }
    })

    if (!admin) {
      throw new Error('Admin User nicht gefunden')
    }

    // Erstelle Demo-Projekt 1: Spielfilm
    const projekt1 = await prisma.project.create({
      data: {
        title: "Der letzte Vorhang",
        description: "Ein dramatischer Spielfilm über das Leben einer alternden Theaterschauspielerin",
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-07-30'),
        genre: "spielfilm",
        status: "in_planung",
        ownerId: admin.id
      }
    })

    // Erstelle Demo-Projekt 2: Dokumentation
    const projekt2 = await prisma.project.create({
      data: {
        title: "Hinter den Kulissen",
        description: "Eine Dokumentation über die deutsche Filmproduktion",
        startDate: new Date('2024-04-15'),
        endDate: new Date('2024-09-30'),
        genre: "dokumentation",
        status: "aktiv",
        ownerId: admin.id
      }
    })

    console.log('Demo-Projekte erstellt:', {
      projekt1: {
        id: projekt1.id,
        title: projekt1.title,
        status: projekt1.status
      },
      projekt2: {
        id: projekt2.id,
        title: projekt2.title,
        status: projekt2.status
      }
    })

  } catch (error) {
    console.error('Fehler beim Erstellen der Demo-Projekte:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoProjects() 