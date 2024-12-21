import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Finde den Admin-User
    const adminUser = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: 'admin@example.com'
          }
        }
      }
    })

    if (!adminUser) {
      throw new Error('Admin User nicht gefunden')
    }

    // App-Ideen
    const appIdeas = [
      {
        title: 'Entwicklungs-Management',
        description: 'System zur Verwaltung und Verfolgung von Entwicklungsideen und Features',
        status: 'IN_PROGRESS',
        priority: 5,
        visibility: 'PUBLIC',
        category: 'Entwicklung',
        createdById: adminUser.id
      },
      {
        title: 'Automatische Untertitel-Generierung',
        description: 'KI-basierte Lösung zur automatischen Generierung von Untertiteln für Videos',
        status: 'SUBMITTED',
        priority: 4,
        visibility: 'PUBLIC',
        category: 'KI & Video',
        createdById: adminUser.id
      },
      {
        title: 'Filmempfehlungs-Engine',
        description: 'Intelligentes System zur personalisierten Filmempfehlung basierend auf Nutzerverhalten',
        status: 'ACCEPTED',
        priority: 3,
        visibility: 'PUBLIC',
        category: 'Recommendation',
        createdById: adminUser.id
      },
      {
        title: 'Automatische Metadaten-Extraktion',
        description: 'Tool zur automatischen Extraktion von Metadaten aus Video-Dateien',
        status: 'SUBMITTED',
        priority: 2,
        visibility: 'PRIVATE',
        category: 'Automatisierung',
        createdById: adminUser.id
      },
      {
        title: 'Streaming-Qualitäts-Optimierung',
        description: 'System zur dynamischen Anpassung der Streaming-Qualität basierend auf Netzwerkbedingungen',
        status: 'ACCEPTED',
        priority: 4,
        visibility: 'PUBLIC',
        category: 'Streaming',
        createdById: adminUser.id
      },
      {
        title: 'Kollaboratives Watchlist-System',
        description: 'Feature für gemeinsame Watchlists in Gruppen mit Abstimmungsfunktion',
        status: 'SUBMITTED',
        priority: 3,
        visibility: 'PUBLIC',
        category: 'Social',
        createdById: adminUser.id
      },
      {
        title: 'KI-gestützte Inhaltsprüfung',
        description: 'Automatische Prüfung von Video-Inhalten auf problematische Szenen',
        status: 'IN_PROGRESS',
        priority: 5,
        visibility: 'PRIVATE',
        category: 'KI & Moderation',
        createdById: adminUser.id
      },
      {
        title: 'Multi-Language Support',
        description: 'Erweiterung der Plattform um umfassende Mehrsprachunterstützung',
        status: 'ACCEPTED',
        priority: 4,
        visibility: 'PUBLIC',
        category: 'Internationalisierung',
        createdById: adminUser.id
      },
      {
        title: 'Erweiterte Suchfunktion',
        description: 'Implementierung einer erweiterten Suchfunktion mit Filtern und Facetten',
        status: 'DONE',
        priority: 5,
        visibility: 'PUBLIC',
        category: 'Suche',
        createdById: adminUser.id
      },
      {
        title: 'Offline-Modus',
        description: 'Entwicklung einer Offline-Funktionalität für die App',
        status: 'REJECTED',
        priority: 2,
        visibility: 'PRIVATE',
        category: 'Funktionalität',
        createdById: adminUser.id
      }
    ]

    // Erstelle die App-Ideen
    for (const [index, idea] of appIdeas.entries()) {
      await prisma.appIdea.create({
        data: {
          ...idea,
          order: index
        }
      })
    }

    console.log('Demo-Daten wurden erfolgreich erstellt')
  } catch (error) {
    console.error('Fehler beim Erstellen der Demo-Daten:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 