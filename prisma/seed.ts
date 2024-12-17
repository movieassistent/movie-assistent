import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create SuperAdmin user
  const superAdminPassword = await bcrypt.hash('MovieAdmin123!', 10)
  
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      password: superAdminPassword,
      role: 'SUPERADMIN',
      emails: {
        create: {
          email: 'admin@movieassistent.com',
          primary: true,
          verified: true
        }
      }
    }
  })

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10)
  
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      password: hashedPassword,
      role: 'USER',
      emails: {
        create: {
          email: 'demo@example.com',
          primary: true,
          verified: true
        }
      }
    }
  })

  // Create demo projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Der Herr der Ringe - Remake',
      description: 'Eine moderne Neuverfilmung des Klassikers mit deutschen Schauspielern',
      status: 'IN_PROGRESS',
      adminId: demoUser.id,
      members: {
        create: {
          userId: demoUser.id,
          role: 'OWNER'
        }
      }
    }
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Berlin Stories',
      description: 'Eine Anthologie-Serie über das Leben in der deutschen Hauptstadt',
      status: 'DRAFT',
      adminId: demoUser.id,
      members: {
        create: {
          userId: demoUser.id,
          role: 'OWNER'
        }
      }
    }
  })

  console.log('Demo data created successfully!')
  console.log('SuperAdmin:', superAdmin)
  console.log('Demo User:', demoUser)
  console.log('Projects:', { project1, project2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
