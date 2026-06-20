# Tuning completo immagini, UX e multilingua

Data: 2026-06-15

## Obiettivo

Controllare il sito da zero con attenzione a:

- homepage
- categorie e sottocategorie
- discussioni/forum
- guide regionali e guide fornitori
- collaborazioni
- versioni EN, ES, FR
- resa desktop, smartphone, iPhone/Safari e Mac
- coerenza delle immagini rispetto al tema della pagina

## Modifiche immagini applicate

- Homepage: sostituita la hero con una foto pi? floreale/evento, pi? calda e meno generica.
- Collaborazioni: sostituita la foto con una scena pi? professionale e viva, adatta a partnership e settore eventi.
- Eventi aziendali: resa pi? coerente con sala/evento aziendale invece di immagini troppo generiche.
- Idee evento: aggiornata con immagine pi? creativa/allestimento.
- Guide regionali: rimosso un duplicato nella rotazione delle immagini "idee evento".
- Conversazioni multilingua: aggiornate immagini base per matrimonio, aziendale e musica/DJ.
- Versioni EN/ES/FR: aggiunti alt testuali contestuali per hero, conversazioni, articoli, guide e pagine locali.

## Regola visiva per le discussioni

La logica immagini delle conversazioni ora controlla anche titolo e contenuto.

Se una discussione parla di:

- catering, menu, buffet, open bar, torta, bevande -> foto catering
- DJ, musica, band, SIAE, playlist -> foto musica/DJ
- location, villa, ristorante, agriturismo, sala, hotel -> foto location
- fiori, floreale, allestimenti, decorazioni, bouquet -> foto fiori/allestimenti
- fotografo, foto, video, videomaker -> foto foto/video

Questo vale anche se la categoria e generica, per esempio "quanto costa" o "problemi fornitori".

## Check desktop

- Hero homepage: immagine full width, overlay leggibile, CTA visibili.
- Card discussioni: immagine a sinistra e testo a destra, senza tagli incoerenti.
- Categorie: 4 rettangoli principali pi? coerenti con il tipo evento.
- Collaborazioni: immagine pi? professionale, testo leggibile, form accessibile.
- Guide: immagini sempre dentro contenitori stabili, senza layout shift evidente.

## Check smartphone

- Hero: immagine resta full bleed, testi sopra leggibili.
- CTA: pulsanti in colonna, tap target ampio.
- Discussioni: card in colonna, immagine sopra o laterale solo quando c'? spazio.
- Analizza preventivo: upload e pulsante bloccato restano leggibili.
- Lingue estere: pagine principali hanno contenuto nella lingua corretta.

## Check iPhone / Safari

- Usati formati immagine compatibili via CDN: JPEG/WebP generati dal servizio immagini.
- Nessun uso di effetti che richiedono hover per funzionare su mobile.
- File upload accetta `image/*`, PDF, Word, RTF, CSV e TXT.
- I pulsanti principali restano visibili anche su schermi stretti.

## Check Mac / desktop largo

- Hero e sezioni principali mantengono larghezza massima controllata.
- Le immagini usano `object-cover` con contenitori a altezza stabile.
- Le sezioni in griglia non lasciano spazi vuoti importanti.
- Il layout resta centrato su viewport larghi.

## Check tecnico eseguito

- TypeScript: OK
- Build Next.js: OK
- Pagine generate: 1352
- Verifica locale statiche/multilingua: OK
- Verifica produzione database routes:
  - `/domande`: 200
  - `/categorie`: 200
  - `/categorie/eventi-aziendali`: 200
  - `/collaborazioni`: 200
  - `/guide-eventi`: 200
  - `/fornitori-eventi`: 200
  - `/en`: 200
  - `/es`: 200
  - `/fr`: 200

## Nota locale

In locale le route che leggono Prisma possono dare 500 se PostgreSQL locale non ? avviato su `localhost:5432`. Questo non riguarda la modifica immagini: sul dominio live le stesse route rispondono correttamente.

## Prossimo tuning consigliato

- Creare una piccola libreria interna `eventImages` con nomi semantici, cos? ogni nuova pagina usa immagini gi? approvate.
- Aggiungere un controllo automatico periodico per immagini duplicate o fuori tema.
- Valutare download locale delle immagini pi? importanti per ridurre dipendenza da CDN esterni nelle pagine core.
