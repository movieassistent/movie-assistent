const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('MovieAdmin123!', 12)
  
  const user = await prisma.user.create({
    data: {
      name: 'Movie Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emails: {
        create: {
          email: 'admin@movieassistent.com',
          primary: true,
          verified: true
        }
      }
    }
  })

  console.log('Admin user created:', user)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 