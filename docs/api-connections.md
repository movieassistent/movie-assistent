# API Verbindungen und Konfigurationen

## Umgebungsvariablen (.env)
Die folgenden Umgebungsvariablen müssen konfiguriert werden:
DATABASE_URL="postgresql://movieassistentsuperadmin:15September198Null@85.215.212.80:5432/movieassistentdb?sslmode=require&ssl=true&sslaccept=accept_invalid_certs"
NEXTAUTH_SECRET="15September198Null"
NEXTAUTH_URL="http://localhost:3000"

```env
OPENAI_API_KEY=your-api-key
TMDB_API_KEY=your-tmdb-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-database-url
```

## API Verbindungen

### 1. OpenAI
- Verwendet für: Chatbot und KI-Funktionalitäten
- API Version: GPT-4
- Konfiguration in: `lib/openai.ts`

### 2. TMDB (The Movie Database)
- Verwendet für: Film- und Serien-Informationen
- API Version: 3
- Basis-URL: `https://api.themoviedb.org/3`
- Konfiguration in: `lib/tmdb.ts`

### 3. Supabase
- Verwendet für: Datenbank und Authentifizierung
- Funktionen:
  - Benutzerauthentifizierung
  - Speicherung von Benutzerdaten
  - Speicherung von Filmvorschlägen
- Konfiguration in: `lib/supabase.ts`

### 4. Prisma
- ORM für Datenbankzugriff
- Schema definiert in: `prisma/schema.prisma`
- Haupttabellen:
  - Users
  - Movies
  - Watchlist
  - Recommendations

## Wichtige Endpunkte

### API Routes
- `/api/chat` - Chatbot Endpunkt
- `/api/movies` - Film-Suche und -Details
- `/api/recommendations` - Filmempfehlungen
- `/api/watchlist` - Watchlist Management

## Authentifizierung
- Implementiert über Supabase Auth
- Unterstützt:
  - Email/Passwort
  - OAuth (Google)

## Datenbank-Schema
Die Haupttabellen und ihre Beziehungen sind in der Prisma-Schema-Datei definiert. Wichtige Tabellen:

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  watchlist     Movie[]
  recommendations Recommendation[]
}

model Movie {
  id          Int      @id
  title       String
  tmdb_id     Int      @unique
  users       User[]
}

model Recommendation {
  id          String   @id @default(cuid())
  userId      String
  movieId     Int
  user        User     @relation(fields: [userId], references: [id])
  movie       Movie    @relation(fields: [movieId], references: [id])
}
```

## Nächste Schritte für die Migration
1. Stelle sicher, dass alle Umgebungsvariablen korrekt gesetzt sind
2. Führe die Prisma-Migrationen aus
3. Überprüfe die API-Verbindungen
4. Teste die Authentifizierung
5. Verifiziere die Datenbankverbindung
