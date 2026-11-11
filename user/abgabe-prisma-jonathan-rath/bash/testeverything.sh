#!/bin/sh
set -eu

# Verwendung: ./test-api.sh [API-URL]
BASE_URL="${1:-http://localhost:3000}"
BASE_URL="${BASE_URL%/}"

for cmd in curl jq; do
    command -v "$cmd" >/dev/null 2>&1 || {
        echo "Fehlt: $cmd" >&2
        exit 1
    }
done

result=$(mktemp)
trap 'rm -f "$result"' EXIT HUP INT TERM

request() {
    method=$1
    path=$2
    expected=$3

    if [ "$#" -eq 4 ]; then
        status=$(curl -sS -o "$result" -w '%{http_code}' \
            -X "$method" "$BASE_URL$path" \
            -H 'Content-Type: application/json' -d "$4")
    else
        status=$(curl -sS -o "$result" -w '%{http_code}' \
            -X "$method" "$BASE_URL$path")
    fi

    printf '\n%s %s -> HTTP %s (erwartet: %s)\n' "$method" "$path" "$status" "$expected"
    cat "$result"
    printf '\n'

    if [ "$status" != "$expected" ]; then
        echo "FEHLER: Unerwarteter HTTP-Status" >&2
        exit 1
    fi
}

new_id() {
    jq -er '.insertId | select(type == "number" and . > 0)' "$result"
}

echo "Teste API: $BASE_URL"

# Startseite und Rollen
request GET / 200
request GET /role 200
request GET /role/1 200
request GET /role/2 200
request GET /role/3 200
request GET /role/abc 400

# User anzeigen und drei neue User erstellen
request GET /user 200
request POST /user/create 201 '{"name":"Curl Anna","roleId":1}'
id1=$(new_id)
request POST /user/create 201 '{"name":"Curl Ben","roleId":2}'
id2=$(new_id)
request POST /user/create 201 '{"name":"Curl Clara","roleId":3}'
id3=$(new_id)

echo "Erstellte User-IDs: $id1, $id2, $id3"

# Alle und einzelne User abfragen
request GET /user 200
request GET "/user/$id1" 200
request GET "/user/$id2" 200
request GET "/user/$id3" 200

# Zweiten User ändern und erneut abfragen
request PUT "/user/update/$id2" 200 '{"name":"Curl Ben Updated","roleId":3}'
request GET "/user/$id2" 200

# Dritten User löschen und 404 prüfen
request DELETE "/user/delete/$id3" 200
request GET "/user/$id3" 404

# Fehlerfall beim Erstellen und Endstand abfragen
request POST /user/create 400 '{"name":""}'
request GET /user 200

printf '\nAlle HTTP-Status-Tests erfolgreich.\n'
printf 'User %s und %s bleiben in der Datenbank; User %s wurde gelöscht.\n' "$id1" "$id2" "$id3"

