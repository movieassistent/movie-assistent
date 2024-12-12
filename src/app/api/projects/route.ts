import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import type { Session } from 'next-auth'
import { ProjectStatus, Prisma } from '@prisma/client'

interface ExtendedSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  }
}

interface CreateProjectRequest {
  name: string;
  description?: string | null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
            user: true,
            department: true
          }
        },
        departments: {
          include: {
            hod: true
          }
        }
      }
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as CreateProjectRequest
    
    const projectData: Prisma.ProjectCreateInput = {
      name: body.name,
      description: body.description ?? null,
      admin: {
        connect: { id: session.user.id }
      },
      status: ProjectStatus.DRAFT
    }

    const project = await prisma.project.create({
      data: projectData,
      include: {
        admin: true
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' }, 
      { status: 500 }
    )
  }
} 