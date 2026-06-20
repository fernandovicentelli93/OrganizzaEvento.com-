# Tuning analizza preventivo - upload e multilingua

Data: 2026-06-15

## Intervento

- La sezione "Analizza preventivo" ora accetta testo, immagini, PDF, Word, RTF, CSV e TXT.
- Il file caricato non viene pubblicato direttamente.
- I nomi file vengono nascosti nell'interfaccia.
- Il testo incollato o letto da file testuali viene anonimizzato automaticamente.
- Il pulsante per aprire la conversazione e sempre visibile ma disabilitato finch? non viene inserito testo o caricato un file.

## Oscuramento automatico

Il sistema sostituisce automaticamente:

- email
- telefoni
- link
- indirizzi
- codici fiscali
- partita IVA / VAT / NIF / SIRET
- IBAN
- nomi azienda con forme riconoscibili
- campi espliciti come fornitore, supplier, proveedor, prestataire, azienda, company

## Multilingua

La pagina analisi ora e allineata anche su:

- `/en/analyze-quote`
- `/es/analizar-presupuesto`
- `/fr/analyser-devis`

Ogni versione ha:

- testi nella lingua corretta
- guida a 3 step
- analizzatore con labels tradotte
- pulsante bloccato/sbloccato tradotto
- CTA verso conversazione coerente con la lingua

## Tuning desktop

- Layout a due colonne: input/upload a sinistra, analisi a destra.
- Il pulsante conversazione resta in alto nella colonna analisi.
- Anteprima anonimizzata leggibile ma contenuta in altezza.

## Tuning mobile

- Le colonne diventano una sotto l'altra.
- Il bottone resta subito visibile nella sezione analisi.
- Le card file e le anteprime immagine non rompono la larghezza.

## Nota tecnica

Per immagini, PDF scansionati e Word non leggibili lato browser, il sito non pubblica il contenuto del file. Viene usata una nota generica senza dati personali; per un'analisi pi? precisa l'utente pu? incollare le voci principali.
