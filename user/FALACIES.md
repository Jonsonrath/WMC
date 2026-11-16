
# 01 Fallacies im eigenen Service

**Partner:** Luca Aigner

| Irrtum | Was passiert bei mir? | Wie könnte man es beheben? |
|---|---|---|
| **Netzwerk zuverlässig** | DB auf `10.10.0.249:3306` erreichbar. `GET /users` ==> HTTP 200 nach ca. 98 ms. `GET /users/1` ==> HTTP 404. DB-Ausfall nicht getestet (kein Docker-Zugriff). | HTTP 503 bei DB-Ausfall zurückgeben, kürzere Timeouts + Health-Check einbauen. |
| **Latenz null** | 10 TCP-Verbindungen ==> 14–20 ms. `GET /users` ==> ca. 15–53 ms. SQL-Query mit `SLEEP(0.05)` ==> 50 ms. Prisma-Query-Anzahl nicht überprüft. | `include: { role: true }` verwenden, um N+1 zu vermeiden. Pagination einbauen. |
| **Topologie fix** | DB läuft in Docker (`c30c0327867e`). MariaDB über Port `3306` erreichbar. Service-Umbenennung nicht getestet (kein Docker-Zugriff). | Hostnamen über `.env` konfigurieren. Bei Änderungen `DATABASE_URL` und `PMA_HOST` anpassen. |
| **Netzwerk sicher** | Ports `3000` und `3306` erreichbar, `8081` geschlossen. Remote-Login als `root@%` funktioniert. Root hat `ALL PRIVILEGES`. TLS deaktiviert (`have_ssl = DISABLED`). | DB-Port nur intern freigeben, TLS aktivieren, Remote-Root-Zugriff einschränken und eigenen DB-User verwenden. |
