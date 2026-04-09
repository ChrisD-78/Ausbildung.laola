# LA OLA Karriere Website

## Backend Mailversand (unsichtbar)

### 1) Abhaengigkeiten installieren
```bash
npm install
```

### 2) Umgebungsvariablen setzen
```bash
cp .env.example .env
```

Dann `.env` mit echten SMTP-Daten fuellen.

### 3) Backend starten
```bash
npm start
```

Das Backend laeuft dann standardmaessig auf `http://localhost:3000`.

### 4) Frontend testen
`index.html` im Browser oeffnen (z. B. via lokalem Static Server).
Beim Klick auf "Bewerbung abschicken" wird die Mail serverseitig versendet.
