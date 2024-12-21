import { prisma } from '@/lib/db'

async function updateAdminRole() {
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
      console.log('Admin-Benutzer nicht gefunden')
      return
    }

    // Update die Rolle zu SUPERADMIN
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'SUPERADMIN' }
    })

    console.log('Admin-Rolle wurde erfolgreich auf SUPERADMIN gesetzt!')

  } catch (error) {
    console.error('Fehler beim Aktualisieren der Admin-Rolle:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminRole() 