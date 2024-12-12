import { execSync } from 'child_process';

async function install() {
  try {
    // Lösche alte Installationen
    console.log('Cleaning up...');
    execSync('rm -rf node_modules');
    execSync('rm -rf .prisma');
    execSync('rm -f package-lock.json');
    
    // Installiere Dependencies
    console.log('Installing dependencies...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    
    // Generiere Prisma Client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Installation completed successfully!');
  } catch (error) {
    console.error('Error during installation:', error);
    process.exit(1);
  }
}

install(); 