import { execSync } from 'child_process';

async function syncPrisma() {
  try {
    console.log('Synchronisiere Prisma mit der Datenbank...');
    
    // Generiere Prisma Client
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: "postgresql://movieassistentsuperadmin:15September198Null@85.215.212.80:5432/movieassistentdb"
      }
    });
    
    console.log('Prisma Client wurde erfolgreich generiert!');
  } catch (error) {
    console.error('Fehler:', error);
    process.exit(1);
  }
}

syncPrisma(); 