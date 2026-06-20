# Tuning AI moderation, chatbot e preventivi - 2026-06-17

## Desktop

- Il widget supporto mantiene la posizione in basso a destra e non copre il pulsante principale.
- Il nuovo pulsante "Ricevi un primo aiuto" resta secondario rispetto a "Invia richiesta supporto".
- La risposta rapida non nomina OpenAI o AI: deve sembrare supporto interno della piattaforma.
- Le domande e risposte pubbliche sicure continuano a pubblicarsi subito.
- I contenuti dubbi finiscono in revisione senza comparire pubblicamente.
- I contenuti chiaramente offensivi, politici, diffamatori, spam o con dati personali pubblici vengono bloccati.
- L'analisi preventivo non deve oscurare prezzi, date, orari o numero invitati.

## Smartphone

- Il box supporto resta entro `calc(100vw - 2rem)`.
- La risposta rapida non deve spingere il form fuori schermo in modo ingestibile.
- I campi email e messaggio restano leggibili con tastiera aperta.
- Il pulsante chatbot e il pulsante invio sono separati, grandi e facili da toccare.
- In `analizza-preventivo`, drag/drop e scelta file restano il primo gesto visibile.

## Sicurezza

- OpenAI riceve testi redatti quando possibile.
- I dati sensibili pubblici portano almeno a revisione.
- In caso di errore OpenAI, i filtri locali restano attivi e non bloccano contenuti normali.
- Le richieste fornitori usano una nota operativa privata pi? utile, senza inventare fornitori o disponibilit?.
