# LA OLA Karriere Website

## Mailversand mit Netlify Functions

Das Formular sendet an `/.netlify/functions/bewerbung`.
Die E-Mail wird unsichtbar serverseitig ueber Netlify + SMTP verschickt.

### Netlify Environment Variables

In Netlify unter `Site configuration -> Environment variables` setzen:

- `SMTP_HOST`
- `SMTP_PORT` (z. B. `587`)
- `SMTP_SECURE` (`false` bei Port 587, `true` bei 465)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `BEWERBUNG_TO` (z. B. `christof.drost@landau.de`)

### Deploy

Netlify nutzt `netlify.toml`:

- publish: `.`
- functions: `netlify/functions`

Danach neu deployen, dann funktioniert der Versand direkt ueber
`https://ausbildung-laola.netlify.app/.netlify/functions/bewerbung`.
