# Tuning drag and drop preventivo - 2026-06-16

## Modifica

- Aggiunta una zona drag and drop nell'area `Analizza preventivo`.
- La zona accetta foto, screenshot, PDF, Word, TXT, CSV e immagini.
- Il pulsante `Scegli file` resta disponibile per mobile e per chi preferisce il selettore classico.
- Drag and drop e selettore file usano lo stesso flusso di lettura gi? esistente.
- I testi sono stati tradotti per italiano, inglese, spagnolo e francese.

## Controlli eseguiti

- `pnpm build`: superato.
- `pnpm test:quote-product`: superato.
- `pnpm test:quote-scoring`: superato.
- Test upload TXT: il testo viene letto e inserito automaticamente nel campo preventivo.

## File tuning viewport

| Pagina | Viewport | Esito |
| --- | --- | --- |
| `/analizza-preventivo` | 390x844 mobile | ok, overflow 0 |
| `/analizza-preventivo` | 820x1180 iPad | ok, overflow 0 |
| `/analizza-preventivo` | 1440x900 desktop | ok, overflow 0 |
| `/en/analyze-quote` | 390x844 mobile | ok, overflow 0 |
| `/es/analizar-presupuesto` | 390x844 mobile | ok, overflow 0 |
| `/fr/analyser-devis` | 390x844 mobile | ok, overflow 0 |

## Note UX

- Desktop: l'utente pu? trascinare direttamente screenshot o file sopra la card.
- Mobile: la card resta chiara e il caricamento passa da `Scegli file`, compatibile con galleria, fotocamera e file manager.
- Il file originale non viene pubblicato: viene usato per preparare il testo e l'analisi.
