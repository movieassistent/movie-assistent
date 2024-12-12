import { execSync } from 'child_process';

async function setup() {
  try {
    console.log('Cleaning up...');
    execSync('rm -rf node_modules');
    execSync('rm -rf .prisma');
    execSync('rm -f package-lock.json');
    
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('Setting up database...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    execSync('npx tsx scripts/create-admin.ts', { stdio: 'inherit' });
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setup(); 