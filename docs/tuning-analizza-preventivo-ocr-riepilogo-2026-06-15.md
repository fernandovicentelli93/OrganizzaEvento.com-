# Tuning Analizza Preventivo - OCR E Riepilogo - 2026-06-15

## Obiettivo
Rendere `Analizza preventivo` pi? utile e meno rigido:
- voto meno severo su preventivi indicativi;
- foto lette automaticamente;
- conversazione pi? descrittiva;
- riepilogo breve dell'offerta del fornitore.

## Algoritmo Voto
- `A partire da`, `prezzo indicativo`, `per persona`, `starting from`, `precio orientativo`, `prix indicatif` non vengono pi? trattati come difetti pesanti.
- `Trattativa riservata`, `prezzo su richiesta`, `price on request`, `sur demande` non fanno crollare il voto: abbassano leggermente la chiarezza ma generano una lettura ragionata.
- Il voto ora misura meglio se il preventivo ? confrontabile, non solo se contiene un totale finale.
- Il sistema resta prudente: se manca il prezzo finale, spinge a chiedere condizioni, inclusi, extra e momento di conferma del totale.

## OCR Immagini
- Le immagini vengono lette automaticamente nel browser con OCR.
- Il testo riconosciuto entra nell'analisi senza chiedere al cliente di trascrivere le righe.
- Il testo riconosciuto viene mostrato come anteprima e poi oscurato se contiene dati sensibili.
- PDF e Word restano allegati privati per preparare la conversazione; TXT e CSV vengono importati automaticamente.

## UX Desktop
- Il risultato mostra subito:
  - voto a pallini;
  - riepilogo dell'offerta;
  - lettura ragionata;
  - inclusi, extra, punti poco chiari e domande.
- La conversazione pronta e pi? narrativa e meno a blocchi standard.

## UX Mobile
- Il flusso resta verticale:
  - carica o incolla;
  - OCR/anteprima;
  - riepilogo;
  - voto;
  - domande.
- Nessun campo manuale obbligatorio per le immagini.

## Multilingua
- Tutte le etichette OCR e la lettura ragionata sono presenti in italiano, inglese, spagnolo e francese.
- Le versioni estere mantengono il focus su confronto con clienti e fornitori italiani.
