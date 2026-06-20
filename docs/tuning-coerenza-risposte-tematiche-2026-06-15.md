# Tuning coerenza risposte per tema - 15 giugno 2026

## Obiettivo
Ogni domanda deve ricevere risposte coerenti con il tema reale della conversazione.

Esempi:
- domanda su fiori -> risposte su bouquet, strutture, stagionalit?, montaggio, smontaggio;
- domanda su musica -> risposte su DJ, impianto, SIAE, scaletta, orari;
- domanda su catering -> risposte su menu, camerieri, quantita, bevande, intolleranze;
- domanda su location -> risposte su spazi, piano B, parcheggio, orari, pulizie;
- domanda su fotografo -> risposte su ore, consegna, momenti coperti, viaggio;
- domanda su fornitori -> risposte su contratto, caparra, comunicazioni e prove scritte.

## Modifiche fatte
- Lo script `scripts/enrich-community.ts` ora usa una logica in tre livelli:
  1. tema specifico rilevato da titolo e contenuto;
  2. categoria della conversazione;
  3. consigli universali validi solo se restano pertinenti.
- Aggiunte banche risposta per:
  - fiori e allestimenti;
  - musica, DJ, band e SIAE;
  - catering, menu, buffet e torta;
  - open bar;
  - location, villa, ristorante, giardino e pioggia;
  - foto e video;
  - caparre e problemi con fornitori;
  - eventi aziendali;
  - bambini e animazione;
  - conferme invitati;
  - preventivi e budget;
  - idee evento.
- Le risposte generate in precedenza troppo generiche vengono sostituite al prossimo arricchimento database.
- Rafforzate anche le anteprime conversazione in inglese, spagnolo e francese.

## Controlli eseguiti
- TypeScript: ok.
- Check multilingua su tema/risposta: 0 problemi residui.
- Le risposte non sono solo uniche: ora sono anche agganciate al problema concreto della domanda.
