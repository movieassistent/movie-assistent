import { execSync } from 'child_process';

async function setupPrisma() {
  try {
    console.log('Setting up Prisma...');
    
    // Setze Umgebungsvariablen
    process.env.PRISMA_CLI_BINARY_TARGETS = "debian-openssl-3.0.x";
    
    // Generiere Prisma Client
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_CLI_BINARY_TARGETS: "debian-openssl-3.0.x",
        PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
        PRISMA_CLIENT_ENGINE_TYPE: "binary"
      }
    });
    
    console.log('Creating admin user...');
    execSync('npx tsx scripts/create-admin.ts', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_CLI_BINARY_TARGETS: "debian-openssl-3.0.x",
        PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
        PRISMA_CLIENT_ENGINE_TYPE: "binary"
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupPrisma(); 