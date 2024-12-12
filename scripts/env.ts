import { config } from 'dotenv'
import { join } from 'path'

// Lade .env Datei
config()

// Setze die Umgebungsvariablen explizit
process.env.PRISMA_QUERY_ENGINE_BINARY = "debian-openssl-3.0.x"
process.env.LD_LIBRARY_PATH = "/nix/store/z0x0kc32f5c4dg5qj9yk6wjzr6vjx8v5-openssl-3.0.12/lib" 