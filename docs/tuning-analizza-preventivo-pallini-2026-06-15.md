# Tuning Analizza Preventivo - 2026-06-15

## Obiettivo
Rendere `Analizza il mio preventivo` una sezione centrale della piattaforma: pi? bella, pi? chiara, pi? utile e capace di trasformare un preventivo in una conversazione pubblicabile.

## Desktop
- Hero editoriale con immagine evento, titolo forte e CTA immediata.
- Card laterale con promessa concreta: voci incluse, extra, domande, voto e bozza discussione.
- Analizzatore in due colonne: caricamento a sinistra, risultato a destra.
- Pulsante `Inizia conversazione` sempre visibile nella colonna risultati.
- Pulsante disabilitato finch? non viene caricato o scritto almeno un preventivo.
- Voto a 10 pallini con mezzi punti, utile per lettura rapida.

## Smartphone
- Hero leggibile in verticale, senza elementi sovrapposti.
- Step ridotti a card semplici con immagine e testo breve.
- Analizzatore in colonna unica: prima upload/testo, poi risultato.
- CTA grande e facile da premere.
- Sezioni di analisi separate in blocchi brevi per evitare muri di testo.

## Logica Preventivo
- Rilevamento tema da testo e nome file: musica/DJ, catering, location, foto/video, fiori/allestimenti, open bar, eventi aziendali o generico.
- Domande diverse in base al tema rilevato.
- Analisi composta da:
  - cosa sembra incluso;
  - extra da controllare;
  - punti poco chiari;
  - domande intelligenti da fare;
  - lettura del preventivo;
  - bozza pronta per aprire una conversazione.
- Redazione automatica di email, telefoni, link, indirizzi, codici fiscali, partita IVA, IBAN e nomi azienda riconoscibili.

## Voto A Pallini
- Il voto va da 1 a 10 con mezzi punti.
- Valuta chiarezza, completezza e rischio di extra.
- Non promette che il prezzo sia alto o basso in assoluto: aiuta a capire se il preventivo ? scritto bene o se nasconde zone da chiarire.

## File E Immagini
- Supportati: immagini, PDF, Word, RTF, TXT, CSV.
- I file non vengono pubblicati direttamente.
- I file di testo vengono letti e inseriti nell'analisi.
- Per foto, PDF scansionati e Word, la pagina chiede di trascrivere le righe principali leggibili: questo mantiene l'MVP affidabile fino al collegamento OCR/AI vision.

## Flusso Community
- Dopo l'analisi, il pulsante apre `/fai-domanda`.
- La domanda viene precompilata con titolo, contenuto, categoria, tipo post e fase evento.
- Il contenuto pubblicabile usa solo testo anonimizzato e strutturato.
