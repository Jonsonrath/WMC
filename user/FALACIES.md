# 01 Fallacies im eigenen Service

**Partner:** Luca Aigner

## 1. Netzwerk zuverlässig

**Was passiert bei mir?**

- DB gestoppt ==> HTTP 500 nach ca. 10s (`INTERNAL_ERROR`)
- Node läuft weiter
- DB wieder gestartet ==> alles funktioniert wieder (ohne Neustart)

**Verbesserung:**

- HTTP 503 statt 500 zurückgeben
- Kürzere Timeouts + Health-Check einbauen

## 2. Latenz null

**Was passiert bei mir?**

- `GET /user` ==> 2 Queries, auch bei 202 Usern
- Kein N+1 Problem
- 50ms pro Query ==> ca. 100ms insgesamt (ohne Verarbeitung)

**Verbesserung:**

- `include: { role: true }` beibehalten
- Pagination einbauen ==> nicht alle User auf einmal laden

## 3. Topologie fix

**Was passiert bei mir?**

- DB-Service `db` umbenannt ==> phpMyAdmin findet DB nicht mehr (`PMA_HOST: db`)
- App funktioniert weiterhin ==> verwendet `127.0.0.1:3306`

**Verbesserung:**

- Hostnamen in der Config anpassen
- Umgebungsvariablen (`.env`) verwenden

## 4. Netzwerk sicher

**Was passiert bei mir?**

- Ports `3306`, `8081`, `3000` auf `0.0.0.0` erreichbar
- Passwort `secret` im Code/Compose
- API ohne Auth ==> jeder mit Zugriff kann User ändern/löschen

**Verbesserung:**

- Ports nur lokal binden (`127.0.0.1`)
- Passwörter aus Code/Compose entfernen
- Authentifizierung einbauen