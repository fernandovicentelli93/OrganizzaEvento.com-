# Tuning immagini OrganizzaEvento.com - 14 giugno 2026

Obiettivo: mantenere il sito emozionale e ricco di foto, ma senza rallentare tel?fono, pagine guida, homepage e forum.

## Regola generale

- Una sola immagine principale per pagina deve essere caricata subito: hero homepage, hero articolo, hero guida, hero categoria o hero domanda.
- Tutte le immagini sotto la prima schermata devono usare caricamento ritardato.
- Le immagini decorative o di card devono essere pi? leggere rispetto agli hero.
- Ogni immagine deve avere dimensione visiva stabile: niente spazi vuoti, salti o card che cambiano altezza mentre caricano.
- Le foto devono avere senso rispetto al contenuto: matrimonio, festa privata, aziendale, budget, fornitori o guida locale.

## Desktop

- Hero editoriali: larghezza remota consigliata 1600-1700 px, qualit? 76-78.
- Card grandi homepage/categorie: larghezza remota consigliata 1000-1200 px, qualit? 76.
- Card forum e liste: larghezza remota consigliata 760-900 px, qualit? 76.
- Miniature archivio guide: sempre `loading="lazy"` e `decoding="async"`.
- Banner Vibes Planner: mantenere dimensione contenuta; il banner orizzontale non deve dominare la pagina.

## Cellulare

- La prima immagine deve occupare il ruolo emozionale ma non bloccare la lettura.
- Liste, guide e magazine devono caricare le immagini solo quando l'utente scorre.
- Evitare banner larghi o quadrati sopra il contenuto principale.
- Le card con immagini devono avere altezza fissa o proporzione stabile.
- Il testo deve restare leggibile sopra le foto: overlay scuro leggero, mai immagine troppo chiara sotto testo bianco.

## Modifiche applicate

- Homepage: hero caricato con priorit? alta; immagini magazine, guide e fornitori caricate in lazy.
- Forum: immagini delle conversazioni in lazy nelle liste; immagine dettaglio domanda prioritaria.
- Categorie: card evento in lazy; dettaglio categoria con hero prioritario.
- Guide eventi: hero dettaglio guida prioritario; liste e archivio guide in lazy.
- Magazine: articolo principale prioritario; card articolo e categorie in lazy.
- Pagine SEO locali: hero prioritario; immagini sorgente alleggerite da 1800/84 a 1600/78.
- Analizza preventivo: miniature ridotte e in lazy.
- Trova fornitori e collaborazioni: immagini laterali alleggerite e in lazy.
- Banner Vibes Planner: aggiunto `sizes` per evitare render troppo grande nei layout responsive.

## Parametri aggiornati

- `lib/visuals.ts`: immagini conversazioni da `w=700&q=82` a `w=760&q=76`.
- `lib/magazine.ts`: hero e immagini categoria alleggerite mantenendo effetto editoriale.
- `lib/editorial.ts`: immagini categorie magazine portate a `w=1200&q=76`.
- `content/local-seo/index.ts`: immagini SEO locali portate a `w=1600&q=78`.
- `content/landing-pages/index.ts`: immagini landing guida portate a `w=1600&q=78`.
- `content/landing-pages/regional-guides.ts`: immagini regionali portate a `w=1600&q=78`.

## Regole per nuove immagini

- Nuova hero: usare una foto realistica, coerente, non stock generica, con soggetto leggibile anche da mobile.
- Nuova immagine card: massimo 900-1100 px di larghezza remota.
- Nuova immagine guida locale: massimo 1600 px, qualit? 78.
- Nuova immagine miniatura: massimo 760 px, qualit? 72-76.
- Nuovo asset locale in `public`: puntare a meno di 250 KB, salvo eccezioni motivate.
- Non usare la stessa foto in troppe sezioni consecutive: alternare per area e intento.

## Checklist dopo ogni modifica visuale

- Desktop homepage: hero, tre conversazioni, categorie evento, guide, magazine e FAQ senza salti.
- Mobile homepage: header stabile, hero leggibile, immagini non tagliate male, nessun overflow laterale.
- Desktop guide: ricerca guide, card e archivio con immagini leggere.
- Mobile guide: filtri impilati, immagini lazy e card leggibili.
- Desktop forum: immagini grandi ma non dominanti, CTA visibili.
- Mobile forum: card a colonna, foto coerenti, testo subito leggibile.
- Build: verificare TypeScript e build Next.

## Aggiornamento 15 giugno 2026

- Eliminata dalle guide regionali la foto architettonica astratta ripetuta su Abruzzo/Lombardia.
- Le guide regionali ora scelgono immagini per tema: matrimoni, feste private, eventi aziendali, preventivi/fornitori e idee locali.
- Regola aggiunta: nelle guide non usare foto fredde di architettura astratta quando non mostrano un evento, un allestimento, persone, tavoli, fornitori o una situazione utile.
- Verifica produzione: immagine `photo-1518005020951-eccb494ad742` assente dalla pagina /guide-eventi.

## Tuning favicon e icone - 15 giugno 2026

- Desktop: favicon, icona browser e icone manifest ridisegnate con segno pi? pieno e meno margine vuoto.
- Mobile: aggiunte versioni 32x32, 48x48, 180x180, 192x192 e 512x512; le dimensioni piccole sono ottimizzate a parte, non solo ridotte dalla grande.
- Ricerca Google: aggiunto `favicon.ico` alla radice e dichiarato nei metadata, cos? crawler e browser trovano subito l'icona pi? compatibile.
- Social preview: badge Open Graph portato a 900x900 con icona centrale pi? leggibile.
- Regola operativa: per favicon e icone non usare mai un logo con troppo spazio bianco; a 16/32 px il simbolo deve restare riconoscibile.

## Tuning overlay foto e leggibilit? - 15 giugno 2026

- Desktop: le card "Parliamo di..." usano overlay pi? scuro nella parte bassa e CTA con fondo bianco pieno.
- Desktop: header reso opaco per evitare testi scuri sopra immagini scure quando la pagina e in alto.
- Mobile: mantenute le stesse altezze e la stessa griglia responsive; intervento limitato a contrasto e sfondi.
- Regola operativa: evitare classi Tailwind con opacita non standard non arbitrarie; usare valori generati come /20, /40, /60, /90, /95 oppure classi solide.

## Tuning foto tagliate male - 15 giugno 2026

- Rimossa dal progetto la foto `photo-1511795409834-ef04bbd61622`, perch? in alcune card tagliava il volto della persona.
- Sostituita con foto pi? sicure per tavola, catering e conversazioni fornitori: soggetti leggibili, composizione larga e nessun volto tagliato in alto.
- Desktop/mobile: quando una foto contiene persone, controllare sempre il crop in card verticali e orizzontali prima di pubblicarla.
