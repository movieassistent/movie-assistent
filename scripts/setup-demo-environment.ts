import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Lösche alle bestehenden Daten
    await prisma.email.deleteMany()
    await prisma.appIdea.deleteMany()
    await prisma.user.deleteMany()

    // Erstelle Superadmin
    const superadmin = await prisma.user.create({
      data: {
        name: 'Superadmin',
        password: await bcrypt.hash('superadmin123', 12),
        role: 'SUPERADMIN',
        emails: {
          create: {
            email: 'admin@example.com',
            verified: true,
            primary: true
          }
        }
      },
      include: {
        emails: true
      }
    })

    // Erstelle Demo User
    const demoUser = await prisma.user.create({
      data: {
        name: 'Demo User',
        password: await bcrypt.hash('demo123', 12),
        role: 'USER',
        emails: {
          create: {
            email: 'demo@example.com',
            verified: true,
            primary: true
          }
        }
      },
      include: {
        emails: true
      }
    })

    // App-Ideen
    const appIdeas = [
      {
        title: 'Entwicklungs-Management',
        description: 'System zur Verwaltung und Verfolgung von Entwicklungsideen und Features',
        status: 'IN_PROGRESS',
        priority: 5,
        visibility: 'PUBLIC',
        category: 'Entwicklung',
        createdById: superadmin.id
      },
      {
        title: 'Automatische Untertitel-Generierung',
        description: 'KI-basierte Lösung zur automatischen Generierung von Untertiteln für Videos',
        status: 'SUBMITTED',
        priority: 4,
        visibility: 'PUBLIC',
        category: 'KI & Video',
        createdById: superadmin.id
      },
      {
        title: 'Filmempfehlungs-Engine',
        description: 'Intelligentes System zur personalisierten Filmempfehlung basierend auf Nutzerverhalten',
        status: 'ACCEPTED',
        priority: 3,
        visibility: 'PUBLIC',
        category: 'Recommendation',
        createdById: superadmin.id
      },
      {
        title: 'Automatische Metadaten-Extraktion',
        description: 'Tool zur automatischen Extraktion von Metadaten aus Video-Dateien',
        status: 'SUBMITTED',
        priority: 2,
        visibility: 'PRIVATE',
        category: 'Automatisierung',
        createdById: superadmin.id
      },
      {
        title: 'Streaming-Qualitäts-Optimierung',
        description: 'System zur dynamischen Anpassung der Streaming-Qualität basierend auf Netzwerkbedingungen',
        status: 'ACCEPTED',
        priority: 4,
        visibility: 'PUBLIC',
        category: 'Streaming',
        createdById: superadmin.id
      },
      {
        title: 'Kollaboratives Watchlist-System',
        description: 'Feature für gemeinsame Watchlists in Gruppen mit Abstimmungsfunktion',
        status: 'SUBMITTED',
        priority: 3,
        visibility: 'PUBLIC',
        category: 'Social',
        createdById: superadmin.id
      },
      {
        title: 'KI-gestützte Inhaltsprüfung',
        description: 'Automatische Prüfung von Video-Inhalten auf problematische Szenen',
        status: 'IN_PROGRESS',
        priority: 5,
        visibility: 'PRIVATE',
        category: 'KI & Moderation',
        createdById: superadmin.id
      },
      {
        title: 'Multi-Language Support',
        description: 'Erweiterung der Plattform um umfassende Mehrsprachunterstützung',
        status: 'ACCEPTED',
        priority: 4,
        visibility: 'PUBLIC',
        category: 'Internationalisierung',
        createdById: superadmin.id
      },
      {
        title: 'Erweiterte Suchfunktion',
        description: 'Implementierung einer erweiterten Suchfunktion mit Filtern und Facetten',
        status: 'DONE',
        priority: 5,
        visibility: 'PUBLIC',
        category: 'Suche',
        createdById: superadmin.id
      },
      {
        title: 'Offline-Modus',
        description: 'Entwicklung einer Offline-Funktionalität für die App',
        status: 'REJECTED',
        priority: 2,
        visibility: 'PRIVATE',
        category: 'Funktionalität',
        createdById: superadmin.id
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

    console.log('Demo-Umgebung wurde erfolgreich eingerichtet:', {
      superadmin: {
        id: superadmin.id,
        name: superadmin.name,
        email: superadmin.emails[0].email
      },
      demoUser: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.emails[0].email
      },
      appIdeasCount: appIdeas.length
    })
  } catch (error) {
    console.error('Fehler beim Einrichten der Demo-Umgebung:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 