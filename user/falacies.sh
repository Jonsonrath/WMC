
#!/usr/bin/env bash

HOST="10.10.0.249"
DB_PORT=3306
API_PORT=3000
DB_USER="root"
DB_NAME="user-admin"

echo "=================================="
echo " FALLACIES TEST - $HOST"
echo "=================================="

for cmd in curl nc mariadb; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Fehlt: $cmd"
        exit 1
    fi
done

echo
echo "=== 1. NETZWERK ZUVERLAESSIG ==="

echo "== TCP-Verbindung zur DB =="
nc -vz -w 3 "$HOST" "$DB_PORT"

echo
echo "== HTTP-Endpunkte =="

for path in / /users /users/1 /user /role /api/users; do
    echo "GET $path"
    curl -sS --connect-timeout 3 --max-time 10 \
        -o /dev/null \
        -w 'HTTP %{http_code} | Zeit: %{time_total}s\n' \
        "http://$HOST:$API_PORT$path"
done

echo
echo "=== 2. LATENZ NULL ==="

echo "== 10 TCP-Verbindungen =="

for i in {1..10}; do
    start=$(date +%s%N)
    if nc -z -w 3 "$HOST" "$DB_PORT"; then
        end=$(date +%s%N)
        ms=$(( (end - start) / 1000000 ))
        echo "Test $i ==> ${ms}ms"
    else
        echo "Test $i ==> FEHLER"
    fi
done

echo
echo "== 10 HTTP-Anfragen =="

for i in {1..10}; do
    curl -sS --max-time 10 -o /dev/null \
        -w "Test $i ==> HTTP %{http_code}, %{time_total}s\n" \
        "http://$HOST:$API_PORT/users"
done

echo
echo "=== 3. TOPOLOGIE FIX ==="

echo "== Port-Erreichbarkeit =="

for port in 3000 3306 8081; do
    nc -vz -w 3 "$HOST" "$port"
done

echo
echo "=== 4. NETZWERK SICHER ==="

echo "== Versions- und Portscan =="

if command -v nmap >/dev/null 2>&1; then
    nmap -sV -p 3000,3306,8081 "$HOST"
else
    echo "nmap nicht installiert"
fi

echo
echo "== HTTP-Headers =="

curl -sSI --max-time 5 \
    "http://$HOST:$API_PORT/" | head -15

echo
echo "=== MARIA DB TESTS ==="
echo "Passwort wird einmal abgefragt."
echo "Verbindung erfolgt ohne TLS!"
echo

mariadb --no-defaults --skip-ssl \
    -h "$HOST" \
    -P "$DB_PORT" \
    -u "$DB_USER" \
    -p \
    --table <<'SQL'

SELECT 'SERVER INFORMATION' AS Test;

SELECT VERSION() AS Version,
       @@hostname AS Hostname,
       @@port AS Port;

SELECT 'NETZWERK UND TLS' AS Test;

SHOW GLOBAL VARIABLES
WHERE Variable_name IN (
    'bind_address',
    'have_ssl',
    'require_secure_transport'
);

SHOW STATUS LIKE 'Ssl_cipher';

SELECT 'BENUTZER UND RECHTE' AS Test;

SELECT USER(), CURRENT_USER();

SHOW GRANTS FOR CURRENT_USER();

SELECT 'DATENBANKEN' AS Test;

SHOW DATABASES;

SELECT 'TABELLEN USER-ADMIN' AS Test;

SHOW TABLES FROM `user-admin`;

SELECT 'GESCHAETZTE ZEILENZAHLEN' AS Test;

SELECT TABLE_NAME, TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'user-admin';

SELECT 'SQL-LATENZ' AS Test;

SET profiling = 1;

SELECT 1;
SELECT SLEEP(0.05);
SELECT 1;

SHOW PROFILES;

SET profiling = 0;

SELECT 'TOPOLOGIE INFORMATION' AS Test;

SHOW GLOBAL VARIABLES
WHERE Variable_name IN (
    'hostname',
    'port',
    'bind_address',
    'socket'
);

SQL

echo
echo "=================================="
echo " TESTS ABGESCHLOSSEN"
echo "=================================="
echo
echo "NICHT REMOTE TESTBAR MIT NUR SQL:"
echo "- Docker-DB stoppen/starten"
echo "- Compose-Service umbenennen"
echo "- Prisma-Query-Anzahl feststellen"
echo "- Node-Prozessstatus kontrollieren"
echo "- Passwoerter im Quellcode suchen"
echo
