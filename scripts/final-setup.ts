import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

async function finalSetup() {
  try {
    console.log('Starting final setup...');
    
    // Lösche alte Installationen
    execSync('rm -rf node_modules');
    execSync('rm -rf .prisma');
    execSync('rm -f package-lock.json');
    
    // Setze Umgebungsvariablen
    const envContent = `
DATABASE_URL=${process.env.DATABASE_URL}
NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET}
NEXTAUTH_URL=${process.env.NEXTAUTH_URL}
`.trim();

    writeFileSync('.env', envContent);
    
    // Installiere Dependencies
    console.log('Installing dependencies...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    
    // Generiere Prisma Client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_SCHEMA_ENGINE_TYPE: "binary",
        PRISMA_QUERY_ENGINE_TYPE: "binary",
        PRISMA_ENGINE_TYPE: "binary",
        PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
        PRISMA_CLIENT_ENGINE_TYPE: "binary"
      }
    });
    
    // Erstelle Admin User
    console.log('Creating admin user...');
    execSync('npx tsx scripts/create-admin.ts', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_SCHEMA_ENGINE_TYPE: "binary",
        PRISMA_QUERY_ENGINE_TYPE: "binary",
        PRISMA_ENGINE_TYPE: "binary",
        PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
        PRISMA_CLIENT_ENGINE_TYPE: "binary"
      }
    });
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

finalSetup(); 