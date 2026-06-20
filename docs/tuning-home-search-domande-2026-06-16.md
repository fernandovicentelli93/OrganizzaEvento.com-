# Tuning homepage e ricerca domande - 2026-06-16

## Modifica UX

- Rimossa dalla homepage la card "Cerca tra le domande gi? aperte".
- Rimosso dalla homepage il pulsante hero "Fai una domanda".
- Mantenuti nella hero i due accessi principali: "Analizza preventivo" e "Trova fornitori".
- Spostata la ricerca semplice nella pagina `/domande`, al posto del pannello con filtri multipli.
- Applicata la stessa pulizia alle homepage `/en`, `/es`, `/fr`.
- Aggiunta una ricerca semplice anche nelle pagine conversazioni estere.

## Controlli tecnici

- `pnpm build`: superato.
- `/domande`: aggiunto fallback se il database locale non risponde, cos? la pagina non va in errore 500.
- Browser check con CSS caricato correttamente su server dev pulito.

## File tuning viewport

| Pagina | Viewport | Esito |
| --- | --- | --- |
| `/` | 390x844 mobile | ok, overflow 0 |
| `/domande` | 390x844 mobile | ok, overflow 0, ricerca presente |
| `/` | 820x1180 iPad | ok, overflow 0 |
| `/domande` | 820x1180 iPad | ok, overflow 0, ricerca presente |
| `/` | 1440x900 desktop | ok, overflow 0 |
| `/domande` | 1440x900 desktop | ok, overflow 0, ricerca presente |
| `/en` | 390x844 mobile | ok, overflow 0 |
| `/en/questions` | 390x844 mobile | ok, overflow 0, ricerca presente |
| `/es` | 390x844 mobile | ok, overflow 0 |
| `/es/preguntas` | 390x844 mobile | ok, overflow 0, ricerca presente |
| `/fr` | 390x844 mobile | ok, overflow 0 |
| `/fr/questions` | 390x844 mobile | ok, overflow 0, ricerca presente |

## Nota locale

Il server dev avviato prima della build serviva CSS e chunk con 404, causando immagini larghissime e falso overflow. Il controllo finale e stato fatto su server dev pulito, con CSS caricato e logo a larghezza corretta.
