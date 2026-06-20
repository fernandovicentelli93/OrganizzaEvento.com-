# Tuning preventivo - 2026-06-16

## Modifica

- Aggiunto motore `lib/quoteScoring.ts` per calcolare la qualit? del preventivo su scala 1-10.
- Integrato il risultato nella card esistente "Analisi intelligente" del componente condiviso `QuoteAnalyzer`.
- Il motore usa testo, testo oscurato, servizio, evento, citt?, regione, data, ospiti, durata, importo e checklist.
- Nessun prezzo medio locale inventato.
- Nessun dato sensibile viene reinserito nel risultato pubblico.

## UX desktop

- Pagina testata: `/analizza-preventivo`.
- Preventivo completo catering: blocco "Qualit? del preventivo" visibile con voto 9,1/10.
- Tabella criteri visibile con 8 criteri e punteggio su 100.
- CTA Vibes contestuale presente ma non invasiva.
- Overflow orizzontale: 0 px.

## UX mobile

- Viewport testato: 390 x 844.
- Pagina testata: `/analizza-preventivo`.
- Blocco scoring visibile.
- Voto e tabella criteri leggibili in colonna.
- Overflow orizzontale: 0 px.

## Lingue

- Italiano: `/analizza-preventivo`, card corretta.
- Inglese: `/en/analyze-quote`, card corretta e microcopy tradotta.
- Spagnolo: `/es/analizar-presupuesto`, card corretta e microcopy tradotta.
- Francese: `/fr/analyser-devis`, card corretta e microcopy tradotta.
- Nessuna evidenza tecnica italiana trovata nelle card EN/ES/FR.

## Test automatici

- `pnpm test:quote-scoring`: passato.
- `pnpm test:quote-product`: passato.
- `pnpm build`: passato.

## Casi coperti

- Preventivo completo.
- Preventivo con solo prezzo.
- Trattativa riservata dettagliata.
- Trattativa riservata generica.
- Prezzo "a partire da" ben spiegato.
- Prezzo "a partire da" vago.
- Preventivo fotografo.
- Preventivo DJ.
- Preventivo band.
- Privacy: il risultato non mostra email, tel?fono, P.IVA o nome azienda non oscurati.
