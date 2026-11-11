# User/Role API – Prisma (Jonathan Rath)

REST-API mit Express 5 und Prisma 7 auf einer MariaDB.

## Voraussetzungen

- Node.js 22 oder neuer
- Docker (mit Docker Compose)

## Projekt starten

```sh
# 1. Umgebungsvariablen anlegen (DATABASE_URL)
cp .env.example .env

# 2. Datenbank (MariaDB + phpMyAdmin) starten
docker compose up -d

# 3. Abhängigkeiten installieren (erzeugt auch den Prisma Client)
npm install

# 4. Tabellen anlegen (Migrationen inkl. Rollen user/generic/admin)
npm run db:migrate

# 5. Server starten -> http://localhost:3000
npm start
```

Falls `npm run db:migrate` direkt nach `docker compose up -d` fehlschlägt, ein paar Sekunden warten (MariaDB startet noch) und erneut ausführen.

## Endpunkte

| Methode | Pfad         | Antwort                                            |
| ------- | ------------ | -------------------------------------------------- |
| GET     | /users       | 200, alle User inkl. Rolle                         |
| GET     | /users/:id   | 200 / 404                                          |
| POST    | /users       | 201 mit angelegtem User / 400 bei ungültiger Eingabe |
| PUT     | /users/:id   | 200 / 400 / 404                                    |
| DELETE  | /users/:id   | 204 / 404                                          |
| GET     | /roles       | 200, alle Rollen                                   |
| GET     | /roles/:id   | 200 / 404                                          |

Body für POST und PUT:

```json
{ "name": "Max Mustermann", "roleId": 1 }
```

## Nützliche Befehle

- `npm run typecheck` – TypeScript prüfen
- `npm run lint` – Oxlint
- `npm run test:api` – alle Routen mit curl testen (Server muss laufen, benötigt `curl` und `jq`)
- `npm run studio` – Prisma Studio
- phpMyAdmin: http://localhost:8081 (Server `db`, User `root`, Passwort `secret`)

## Aufbau

- `app.ts` – Express-Setup, Routen, 404 und zentraler Error-Handler
- `errors.ts` – Error-Handler (Prisma P2025 → 404, P2003 → 400)
- `route/` – HTTP-Schicht (Validierung, Statuscodes)
- `services/` – Datenbankzugriff über Prisma (`db.ts`, `user.service.ts`, `role.service.ts`)
- `prisma/schema.prisma` + `prisma/migrations/` – Schema und Migrationen
