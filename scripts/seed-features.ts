import { prisma } from '@/lib/db'
import { AppIdeaStatus } from '@prisma/client'

const initialFeatures = [
  {
    title: "Trello-ähnliche Ideenverwaltung",
    description: "Verwalte Ideen und deren Fortschritt in einem übersichtlichen Kanban-Board. Verschiebe Ideen einfach zwischen verschiedenen Status wie 'Offen', 'In Arbeit' und 'Implementiert'.",
    status: "IN_PROGRESS" as AppIdeaStatus,
    priority: "HIGH"
  },
  {
    title: "Produktionskalender mit Gantt-Ansicht",
    description: "Visualisiere den gesamten Produktionsprozess von der Vorbereitung bis zur Nachbearbeitung in einer interaktiven Gantt-Chart-Ansicht. Plane und überwache alle Phasen deiner Produktion.",
    status: "OPEN" as AppIdeaStatus,
    priority: "HIGH"
  },
  {
    title: "Cast & Crew Verwaltung",
    description: "Zentrale Plattform für alle Teammitglieder. Verwalte Kontakte, Verfügbarkeiten und Zuständigkeiten. Ermögliche Zusammenarbeit und Informationsaustausch über alle Abteilungen hinweg.",
    status: "IN_PROGRESS" as AppIdeaStatus,
    priority: "HIGH"
  },
  {
    title: "Script Import & Szenenaufschlüsselung",
    description: "Importiere Drehbücher aus Final Draft, PDF und anderen Formaten. Automatische Szenenaufschlüsselung und Versionsverwaltung für effizientes Drehbuch-Management.",
    status: "OPEN" as AppIdeaStatus,
    priority: "MEDIUM"
  },
  {
    title: "Drehplan & Tagesauszüge",
    description: "Erstelle und verwalte Drehpläne durch einfaches Drag & Drop von Szenen. Generiere Tagesauszüge in Echtzeit und behalte den Überblick über den Produktionsfortschritt.",
    status: "OPEN" as AppIdeaStatus,
    priority: "HIGH"
  },
  {
    title: "Disposition & Mobile App",
    description: "Erstelle und verwende Vorlagen für Dispositionen. Automatische Befüllung mit relevanten Details und Versand an eine mobile App mit Lesebestätigung.",
    status: "OPEN" as AppIdeaStatus,
    priority: "MEDIUM"
  },
  {
    title: "Ankündigungen & Mailinglisten",
    description: "Halte dein Team auf dem Laufenden mit gezielten Ankündigungen. Verwalte Mailinglisten für Cast und Crew und tracke die Kommunikation.",
    status: "IMPLEMENTED" as AppIdeaStatus,
    priority: "MEDIUM",
    implementedAt: new Date()
  },
  {
    title: "Dateifreigabe & Versionierung",
    description: "Teile und verwalte Dateien direkt in der App. Halte alle Beteiligten auf dem aktuellen Stand und ermögliche externen Zugriff mit granularer Zugriffskontrolle.",
    status: "OPEN" as AppIdeaStatus,
    priority: "HIGH"
  },
  {
    title: "Kommentarsystem",
    description: "Strukturierte Kommunikation durch Kommentare zu Szenen, Dokumenten und Aufgaben. Löse Probleme direkt dort, wo sie entstehen.",
    status: "OPEN" as AppIdeaStatus,
    priority: "MEDIUM"
  },
  {
    title: "Automatisches Wasserzeichen",
    description: "Schütze vertrauliche Dokumente durch automatische Wasserzeichen beim Versand an Cast und Crew. Personalisierte Wasserzeichen für maximale Sicherheit.",
    status: "OPEN" as AppIdeaStatus,
    priority: "LOW"
  },
  {
    title: "Aktivitätsverfolgung",
    description: "Behalte den Überblick wer wann was angesehen, bearbeitet, hoch- oder heruntergeladen hat. Lückenlose Dokumentation aller Aktivitäten.",
    status: "OPEN" as AppIdeaStatus,
    priority: "MEDIUM"
  },
  {
    title: "Erweiterte Berechtigungen",
    description: "Feingranulare Zugriffskontrolle basierend auf Rollen und Positionen. Schütze sensible Daten und steuere den Informationsfluss.",
    status: "IN_PROGRESS" as AppIdeaStatus,
    priority: "HIGH"
  }
]

async function seedFeatures() {
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

    // Erstelle die Features
    for (const feature of initialFeatures) {
      await prisma.appIdea.create({
        data: {
          ...feature,
          createdById: admin.id
        }
      })
    }

    console.log('Features wurden erfolgreich erstellt!')
  } catch (error) {
    console.error('Fehler beim Erstellen der Features:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedFeatures() 