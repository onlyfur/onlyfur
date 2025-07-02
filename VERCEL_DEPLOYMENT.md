# Vercel Deployment Guide

Dieses Projekt ist jetzt so konfiguriert, dass sowohl Frontend als auch Backend auf Vercel deployt werden können.

## Was wurde geändert:

### 1. Neue API-Route für Serverless Functions
- `api/index.ts` - Serverless Express-App für das Backend
- Alle Backend-Routen sind jetzt unter `/api/*` verfügbar

### 2. Aktualisierte vercel.json
- Konfiguration für sowohl Frontend (Vite) als auch Backend (Serverless Functions)
- Rewrites für API-Routen (`/api/*` → `api/index.ts`)
- Rewrites für SPA (`/*` → `index.html`)

### 3. Package.json Updates
- `@vercel/node` als Dev-Dependency hinzugefügt
- Build-Command erweitert um Prisma-Generation

## Deployment auf Vercel:

### 1. Environment Variables in Vercel setzen:
```bash
# In der Vercel Dashboard unter Settings → Environment Variables:
DATABASE_URL="your-postgresql-database-url"
JWT_SECRET="your-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
FRONTEND_URL="https://your-domain.vercel.app"
NODE_ENV="production"
```

### 2. Database Setup:
Für Production wird eine externe PostgreSQL-Datenbank benötigt:
- Vercel Postgres
- Supabase
- Railway
- PlanetScale
- Oder andere PostgreSQL-Provider

### 3. Build & Deploy:
```bash
# Automatisches Deployment via Git:
git add .
git commit -m "Add Vercel serverless backend configuration"
git push

# Oder manuell via Vercel CLI:
npm install -g vercel
vercel --prod
```

## Lokale Entwicklung:

### Frontend + Backend getrennt (empfohlen):
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server:dev
```

### Frontend + Backend zusammen:
```bash
# Startet sowohl Frontend als auch Backend
npm run start:prod
```

## API-Endpunkte:

Nach dem Deployment sind alle API-Endpunkte unter `/api/` verfügbar:
- `/api/auth/*` - Authentifizierung
- `/api/users/*` - Benutzerverwaltung
- `/api/content/*` - Content-Management
- `/api/subscriptions/*` - Abonnements
- `/api/payments/*` - Zahlungen
- `/api/messaging/*` - Nachrichten
- `/api/admin/*` - Admin-Funktionen

## Wichtige Hinweise:

1. **CORS**: Die API ist für die Vercel-Domain konfiguriert
2. **Database**: Prisma wird automatisch beim Build generiert
3. **Environment**: Alle Umgebungsvariablen müssen in Vercel gesetzt werden
4. **Logs**: Serverless Function Logs sind im Vercel Dashboard verfügbar

## Troubleshooting:

### API-Fehler:
- Überprüfe Environment Variables in Vercel
- Kontrolliere Vercel Function Logs
- Stelle sicher, dass die Datenbank erreichbar ist

### Build-Fehler:
- Überprüfe ob alle Dependencies installiert sind
- Kontrolliere TypeScript-Konfiguration
- Stelle sicher, dass Prisma korrekt generiert wird
