import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import ProjectList from '@/components/projects/ProjectList'
import CreateProjectButton from '@/components/projects/CreateProjectButton'
import { RoleGate } from '@/components/RoleGate'

export default async function ProjectsPage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/?showLogin=true')
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { adminId: session.user.id },
        {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      ]
    },
    include: {
      admin: true,
      members: {
        include: {
          user: true
        }
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projekte</h1>
        <RoleGate allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <CreateProjectButton />
        </RoleGate>
      </div>
      <ProjectList projects={projects} />
    </div>
  )
} 