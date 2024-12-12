import { Client } from 'pg';
import { execSync } from 'child_process';
import * as bcrypt from 'bcryptjs';

async function setupWithPg() {
  const client = new Client({
    host: '85.215.212.80',
    port: 5432,
    database: 'movieassistentdb',
    user: 'movieassistentsuperadmin',
    password: '15September198Null'
  });

  try {
    console.log('Verbinde mit Datenbank...');
    await client.connect();
    
    // Erstelle Tabellen
    console.log('Erstelle Tabellen...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'USER',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "Email" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        "primary" BOOL DEFAULT false,
        verified BOOL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"(id)
      );
    `);
    
    // Erstelle Admin User
    const hashedPassword = await bcrypt.hash('MovieAdmin123!', 10);
    
    // Prüfe ob Admin bereits existiert
    const checkResult = await client.query(
      'SELECT * FROM "Email" WHERE email = $1',
      ['admin@movieassistent.com']
    );
    
    if (checkResult.rows.length === 0) {
      console.log('Erstelle Admin User...');
      
      // Erstelle User
      const userId = `user_${Date.now()}`;
      const emailId = `email_${Date.now()}`;
      
      await client.query(
        `INSERT INTO "User" (id, name, password, role, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [userId, 'Admin', hashedPassword, 'ADMIN']
      );
      
      await client.query(
        `INSERT INTO "Email" (id, email, "userId", "primary", verified, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [emailId, 'admin@movieassistent.com', userId, true, true]
      );
      
      console.log('Admin User erfolgreich erstellt!');
    } else {
      console.log('Admin User existiert bereits.');
    }
    
  } catch (error) {
    console.error('Fehler:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupWithPg(); 