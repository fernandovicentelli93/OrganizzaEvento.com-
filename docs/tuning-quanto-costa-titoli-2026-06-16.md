# Tuning titoli Quanto costa - 2026-06-16

## Obiettivo

Rendere i titoli della sezione "Quanto costa" pi? umani, variati e credibili, eliminando formule ripetitive come "bastano davvero", "? realistico", "ci sta" e "sono troppi".

## Modifiche applicate

- Riscritti gli override dei titoli visibili per le conversazioni gi? presenti online.
- Aggiunti override specifici per 18 vecchie conversazioni gi? pubblicate con titoli generati a formula.
- Aggiunti override specifici per le vecchie conversazioni generate con apertura ripetitiva "Quanto costa...".
- Aggiornati i titoli nel seed italiano.
- Aggiornato il generatore di conversazioni costo per evitare nuovi titoli a stampino.
- Mantenute le vecchie stringhe solo come chiavi interne di compatibilita: servono a mostrare il nuovo titolo anche se nel database online e ancora salvato il vecchio.

## Esempi dopo il tuning

- DJ per diciottesimo: 80 invitati, 5 ore e luci base
- Buffet per 50 invitati: stesso menu, due prezzi lontanissimi
- Cena aziendale a Padova: il prezzo sembra ok, ma cosa resta fuori
- Band per matrimonio: il preventivo cambia appena aggiungo il DJ
- Fotografo per conferenza: mi serve davvero la giornata intera
- Open bar dopo cena: meglio prezzo chiuso o tetto massimo

## Check tecnico

- Build Next.js: OK.
- Controllo statico titoli nuovi: OK.
- Layout `/` e `/quanto-costa`:
  - mobile 390px: overflow 0.
  - iPad 768px: overflow 0.
  - desktop 1440px: overflow 0.

## Nota

Il database locale PostgreSQL non era popolato/servibile durante il tuning, quindi la verifica visuale sulle card reali e stata integrata con controllo statico su seed, override e generatore.
