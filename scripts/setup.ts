import { execSync } from 'child_process';

async function setup() {
  try {
    // Lösche den Cache
    console.log('Cleaning cache...');
    execSync('rm -rf node_modules/.prisma');
    execSync('rm -rf node_modules/@prisma');
    
    // Installiere Dependencies neu
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Generiere Prisma Client
    console.log('Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Erstelle Admin User
    console.log('Creating admin user...');
    execSync('npx tsx scripts/create-admin.ts', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setup(); 