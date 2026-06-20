# OrganizzaEvento.com

MVP web per una community italiana dedicata all'organizzazione di eventi.

## Funzioni principali

- Forum con domande, risposte, voti utili, segnalazioni e categorie pratiche.
- Menu con percorsi rapidi per domande, prezzi reali, eventi, magazine e regole.
- Magazine editoriale con articoli SEO, FAQ e dati strutturati.
- Modulo privato "Trova fornitori" con risposta automatica interna.
- Backend riservato con email e password server-side.
- Banner e footer partnership con Vibes Planner.

## Setup locale

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Apri `http://localhost:3000`.

## Variabili ambiente

Copia `.env.example` in `.env` e imposta almeno:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/organizzaevento?schema=public"
ADMIN_EMAIL="supportoforumevento@gmail.com"
ADMIN_SECRET="scegli-una-password-admin-lunga"
CAPTCHA_SECRET="scegli-un-segreto-lungo"
NEXT_PUBLIC_SITE_URL="https://organizzaevento.com"
SUPPORT_EMAIL="supportoforumevento@gmail.com"
```

Lo schema Prisma usa PostgreSQL. Non usare `file:./dev.db` con lo schema attuale.

## Notifiche email

I form salvano le richieste nel backend. Per inviare anche una notifica email automatica a `SUPPORT_EMAIL`, configura uno di questi:

```bash
RESEND_API_KEY=""
RESEND_FROM_EMAIL="OrganizzaEvento <notifiche@organizzaevento.com>"
NOTIFICATION_WEBHOOK_URL=""
```

Se nessuna integrazione email e configurata, il sito continua a funzionare e non blocca l'utente.

Con Resend configurato, OrganizzaEvento.com invia una notifica a `SUPPORT_EMAIL` quando:

- una persona apre una nuova discussione;
- una persona pubblica una risposta;
- arriva una richiesta supporto;
- arriva una richiesta fornitori;
- viene creato un account.

## Backend riservato

Apri:

```text
https://organizzaevento.com/gestione
```

Inserisci `ADMIN_EMAIL` e `ADMIN_SECRET`. La password non deve essere messa nell'indirizzo del sito.

Nel backend puoi vedere richieste fornitori, messaggi supporto, report, domande, risposte e segnare una risposta come piu utile.

## Netlify

Il deploy usa `netlify.toml` e il plugin Next.js:

```bash
npm run build
```

Su Netlify servono le variabili `ADMIN_EMAIL`, `ADMIN_SECRET`, `CAPTCHA_SECRET`, `SUPPORT_EMAIL` e `NEXT_PUBLIC_SITE_URL`.
