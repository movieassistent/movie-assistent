import { Client } from 'pg'

async function testConnection() {
  const client = new Client({
    host: '85.215.212.80',
    port: 5432,
    database: 'movieassistentdb',
    user: 'movieassistentsuperadmin',
    password: '15September198Null'
  })

  try {
    console.log('Versuche Verbindung zur Datenbank aufzubauen...')
    await client.connect()
    console.log('Verbindung erfolgreich!')
    
    const result = await client.query('SELECT version()')
    console.log('PostgreSQL Version:', result.rows[0].version)
    
    // Test Query
    const testResult = await client.query('SELECT NOW()')
    console.log('Test Query erfolgreich:', testResult.rows[0])
    
  } catch (error) {
    console.error('Fehler bei der Datenbankverbindung:', error)
  } finally {
    await client.end()
  }
}

testConnection() 