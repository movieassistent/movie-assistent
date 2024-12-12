import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

async function sqliteSetup() {
  try {
    console.log('Starting SQLite setup...');
    
    // Lösche alte Installationen
    execSync('rm -rf node_modules');
    execSync('rm -rf .prisma');
    execSync('rm -f package-lock.json');
    execSync('rm -f prisma/dev.db');
    
    // Installiere Dependencies
    console.log('Installing dependencies...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    
    // Generiere Prisma Client und erstelle Datenbank
    console.log('Setting up database...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    // Erstelle Admin User
    console.log('Creating admin user...');
    execSync('npx tsx scripts/create-admin.ts', { stdio: 'inherit' });
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

sqliteSetup(); 