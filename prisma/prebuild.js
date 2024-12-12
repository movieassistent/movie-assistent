const { execSync } = require('child_process');

try {
  // Lösche den Cache
  execSync('rm -rf node_modules/.prisma');
  execSync('rm -rf node_modules/@prisma');
  
  // Setze die Umgebungsvariablen
  process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
  process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";
  
  // Generiere den Client
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
      PRISMA_CLIENT_ENGINE_TYPE: "binary"
    }
  });
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
} 