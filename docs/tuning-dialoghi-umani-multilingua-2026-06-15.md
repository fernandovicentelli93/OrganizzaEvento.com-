# Tuning dialoghi umani multilingua - 15 giugno 2026

## Obiettivo
Controllare domande, risposte e anteprime conversazione in italiano, inglese, spagnolo e francese per evitare:
- risposte uguali;
- strutture troppo ripetitive;
- tono freddo o troppo generico;
- contenuti che sembrano scritti in blocco.

## Controlli eseguiti
- Conversazioni estere controllate: 48 totali.
- Lingue controllate: inglese, spagnolo, francese.
- Campi controllati: titolo, estratto, anteprima risposta, status.
- Duplicati esatti dopo correzione: 0.
- Testi troppo simili sopra soglia interna: 0.
- Seed italiano controllato su risposte e FAQ: 188 stringhe.
- Duplicati esatti nel seed dopo correzione: 0.
- TypeScript: ok.
- Build Next.js: ok, 1352 pagine generate.

## Modifiche fatte
- Riscritte le anteprime risposta delle conversazioni estere con dettagli pi? umani:
  - risposte da persone specifiche;
  - piccoli aggiornamenti dell'autore;
  - decisioni prese dopo il confronto;
  - frasi meno astratte e pi? vissute.
- Corretta una frase spagnola che conteneva una parte in italiano.
- Eliminata una ripetizione esatta nelle FAQ del seed italiano.
- Aggiornato lo script `scripts/enrich-community.ts`:
  - risposte diverse per categoria;
  - meno frasi da manuale;
  - pi? casi concreti su location, catering, musica, fornitori, matrimoni, feste private, eventi aziendali e idee evento;
  - sostituzione automatica delle vecchie risposte generiche note create dallo script.

## Nota
Le risposte nuove non promettono verita assolute: sembrano interventi da community, con esperienze, dubbi, piccoli consigli pratici e tono naturale.
