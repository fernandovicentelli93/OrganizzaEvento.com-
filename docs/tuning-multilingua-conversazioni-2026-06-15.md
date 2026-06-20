# Tuning multilingua conversazioni - 2026-06-15

## Obiettivo

Rendere le versioni inglese, spagnola e francese pi? vive, con pi? conversazioni visibili e sottocategorie realmente popolate.

## Cosa e stato fatto

- Aggiunte 10 conversazioni extra per lingua: inglese, spagnolo e francese.
- Ogni conversazione ha autore, badge, citt?, budget, stato, risposte, voti utili e visualizzazioni del giorno.
- Aggiunti articoli magazine extra per ogni lingua.
- Le categorie localizzate ora mostrano tutte le 10 aree, non solo le macro-sezioni.
- Ogni categoria mostra il numero di casi reali collegati.
- Le pagine categoria mostrano conversazioni pertinenti sotto i box principali.
- La pagina "fai domanda" multilingua ora mostra CTA utile, link al form e conversazioni reali sotto.
- Il selettore lingua in header e diventato un menu compatto con lingua corrente e lista a tendina.

## Controllo desktop

- `/es`: hero spagnola corretta, selettore lingua visibile, nessun testo inglese "Ask the community" visibile.
- Menu lingua: aperto correttamente con Italiano, English, Espanol, Francais.

## Controllo smartphone

- `/es/temas`: 10 categorie visibili, tradotte in spagnolo, con contatore "casos reales".
- `/es/hacer-pregunta`: testi in spagnolo, link al form, 4 conversazioni visibili nella prima pagina.
- Nessun residuo "Da dove inizio" nelle categorie spagnole.

## Verifiche tecniche

- TypeScript: ok.
- Build Next.js: ok, 1352 pagine generate.
- Controllo HTML locale: EN/ES/FR senza mix italiano nelle categorie principali.
