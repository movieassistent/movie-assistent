import { prisma } from '@/lib/db'

async function verifyProjects() {
  try {
    // Finde den Admin
    const admin = await prisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: 'admin@movieassistent.com'
          }
        }
      },
      include: {
        ownedProjects: true,
        projectMemberships: true
      }
    })

    console.log('Admin User:', {
      id: admin?.id,
      name: admin?.name,
      ownedProjects: admin?.ownedProjects.length,
      memberships: admin?.projectMemberships.length
    })

    // Zeige alle Projekte
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: {
            name: true,
            emails: {
              where: { primary: true },
              select: { email: true }
            }
          }
        },
        members: true
      }
    })

    console.log('\nProjekte:', projects.map(p => ({
      id: p.id,
      title: p.title,
      owner: p.owner.name,
      memberCount: p.members.length
    })))

  } catch (error) {
    console.error('Fehler bei der Überprüfung:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyProjects() 