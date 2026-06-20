# Tuning 2026-06-16 - Quanto costa, community e sitemap

## Obiettivo
- Rendere la sezione costi pi? chiara: da "Prezzi reali" a "Quanto costa".
- Aumentare la sensazione di community reale con risposte pi? numerose, coerenti e voti misti.
- Correggere l'errore Search Console sulla sitemap annidata dei preventivi.

## Modifiche UX e contenuto
- Header, footer, homepage e pagine localizzate ora usano "Quanto costa" o traduzioni coerenti.
- Le conversazioni estere hanno risposte tra 3 e 14, con autori diversi e ruoli coerenti.
- Le card conversazione mostrano anche voti "non utili" per evitare numeri troppo perfetti.
- Le conversazioni costo sono distribuite per catering, DJ, location, open bar, foto, fiori, planner, transfer, AV, feste private e matrimoni.
- La pagina italiana `/quanto-costa` non mostra pi? Application error se il database locale non risponde: usa un fallback leggibile.

## SEO e sitemap
- `/sitemap.xml` e `/sitemap-index.xml` non includono pi? `/sitemaps/analizza-preventivo/sitemap-index.xml`.
- La sitemap preventivi resta disponibile e dichiarata separatamente in `robots.txt`.
- File AI aggiornati: `ai.txt` e `llms.txt` usano "quanto costa" come concetto principale.

## Check desktop
- Build Next.js completata con 1801 pagine statiche generate.
- `/en/real-prices`, `/es/precios-reales`, `/fr/prix-reels` senza vecchie label.
- Dettaglio conversazione estera verificato: risposte multiple, nessun errore, voti non utili visibili.

## Check mobile
- Viewport 390x844 testato su:
  - `/en/real-prices`
  - `/es/precios-reales`
  - `/fr/prix-reels`
- Overflow orizzontale: assente.
- Conversazioni cliccabili: presenti.
- Voti non utili: visibili.

## Nota operativa Search Console
- In Search Console conviene inviare:
  - `sitemap.xml`
  - `sitemap-it.xml`
  - `sitemap-en.xml`
  - `sitemap-es.xml`
  - `sitemap-fr.xml`
  - `sitemaps/analizza-preventivo/sitemap-index.xml`
- Non inviare la sitemap preventivi come se fosse contenuta dentro un altro indice: ora e separata.
