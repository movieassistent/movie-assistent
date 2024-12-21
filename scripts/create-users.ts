import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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

  console.log('Created users:', {
    superadmin,
    demoUser
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 