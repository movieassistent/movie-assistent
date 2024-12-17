import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

async function windowsSetup() {
  try {
    console.log('Starting Windows setup...');
    
    // Lösche alte Installationen mit Windows-kompatiblen Befehlen
    console.log('Cleaning up...');
    execSync('if exist node_modules rmdir /s /q node_modules', { shell: 'cmd.exe' });
    execSync('if exist .prisma rmdir /s /q .prisma', { shell: 'cmd.exe' });
    execSync('if exist package-lock.json del package-lock.json', { shell: 'cmd.exe' });
    
    // Installiere Dependencies
    console.log('Installing dependencies...');
    execSync('npm install --legacy-peer-deps', { 
      stdio: 'inherit',
      shell: 'cmd.exe'
    });
    
    // Setze Prisma Umgebungsvariablen
    process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
    process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";
    
    // Generiere Prisma Client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
        PRISMA_CLIENT_ENGINE_TYPE: "binary"
      },
      shell: 'cmd.exe'
    });
    
    // Erstelle Demo-Projekte
    console.log('Creating demo projects...');
    execSync('npx tsx scripts/create-demo-projects.ts', { 
      stdio: 'inherit',
      env: process.env,
      shell: 'cmd.exe'
    });
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

windowsSetup(); 