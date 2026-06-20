# Tuning 2026-06-14 - Community, account e lead flow

## Desktop
- Header: logo pi? grande, link Iscriviti vicino al logo, Analizza preventivo evidenziato, Fai una domanda con pulse leggero.
- Header aggiornato: Iscriviti spostato a destra vicino ad Accedi; Regole rimosso dall'header; Domande/Prezzi/Eventi/Magazine raggruppati nel menu Parliamo di... con colonne e sottocategorie al passaggio del mouse.
- CTA Fai una domanda: pulse reso leggermente pi? lampeggiante ma non aggressivo.
- Homepage: rimosso banner orizzontale pubblicitario; rimosso blocco richiesta fornitori dalla home; conversazioni pi? centrali.
- Homepage: consigli pratici spostati sotto le conversazioni; reinseriti i quattro rettangoli Matrimonio, Compleanni e feste private, Eventi aziendali, Idee evento.
- Homepage: i quattro rettangoli evento sono stati spostati fuori dalla colonna principale e ora occupano tutta la larghezza utile della pagina.
- Collaborazioni: pagina resa pi? editoriale con immagine, logo Vibes Planner e banner solo in contesto collaborazione.
- Forum: rimossi banner laterali/invasivi; box fornitori resta solo dentro le discussioni.

## Mobile
- Menu: Iscriviti, Accedi e Analizza preventivo sono accessi rapidi nel menu mobile.
- Menu mobile: niente hover, voce Parliamo di... usata come intestazione e link principali mantenuti grandi e cliccabili.
- CTA: rimosso pulsante fisso basso per evitare sovrapposizione con supporto/chatbot.
- Supporto: chatbot mantiene posizione in basso a destra senza conflitto con Fai una domanda.
- Card: sezioni homepage mantenute in sequenza semplice: hero, conversazioni, consigli, aree evento, prezzi, magazine, FAQ.
- Mobile: le aree evento restano in sequenza verticale ampia, senza colonna laterale vuota o contenuti compressi.

## SEO e AI
- Sitemap aggiornata con /registrati.
- Dashboard e login esclusi da robots.txt.
- /llms.txt e /ai.txt restano attivi per lettura da piattaforme AI.
- Privacy aggiornata per account, richieste fornitori, notifiche, moderazione e contenuti indicizzabili.
- Google Analytics predisposto tramite NEXT_PUBLIC_GA_MEASUREMENT_ID.

## Community e sicurezza
- Account facoltativi cliente/fornitore con dashboard separate.
- Badge cliente/fornitore e gamification: bronzo, argento, oro, platino, diamante.
- Profili senza recapiti pubblici: foto URL, bio, citt?, regione.
- Cancellazione account prevista da dashboard.
- Backend esteso con gestione account e sospensione profili.

## Email
- Resend supportato tramite RESEND_API_KEY e RESEND_FROM_EMAIL.
- Mittente previsto: OrganizzaEvento <notifiche@organizzaevento.com>.
- Invio reale attivo solo dopo inserimento RESEND_API_KEY e completamento verifica DNS del dominio/subdominio.

## Verifica produzione
- Deploy Netlify pronto su https://organizzaevento.com.
- Build completa verificata: 530 pagine generate.
- Registrazione cliente test verificata: redirect corretto a /dashboard/cliente e cookie creato.
- Registrazione fornitore test verificata: redirect corretto a /dashboard/fornitore e cookie creato.
- Backend verificato: accesso attivo, statistiche e area moderazione visibili.
- Moduli supporto e segnalazione verificati tramite diagnostica protetta: salvataggio database riuscito.
- Account database: schema auto-preparato se Netlify parte da database precedente.
- Mobile: menu aperto e controllato a 390 px; presenti Iscriviti, Accedi, Analizza preventivo, Cliente e Fornitore.
- SEO: /sitemap.xml, /robots.txt, /llms.txt, /privacy, /collaborazioni, /analizza-preventivo e /registrati rispondono 200.
- Homepage: banner orizzontale Vibes Planner rimosso; resta la collaborazione nel footer/pagina collaborazioni e il banner quadrato solo nei contesti fornitori.
- Privacy: nessun riferimento a Vibes Planner, FVM o partita IVA nella pagina privacy.

## Tuning guide regionali 2026/2027
- Aggiunte 100 guide regionali nuove: 20 regioni per 5 intenti editoriali.
- Totale guide pubblicate: 600.
- Controllo unicita: 0 slug duplicati.
- Build verificata: 630 pagine generate.
- Pagina /guide-eventi: aggiunta ricerca con testo libero, filtro regione, filtro tipo evento, filtro tipo guida e geolocalizzazione opzionale.
- Homepage: aggiunte 2 preview di guide regionali prima delle FAQ.
- Mobile: filtri guide impilati, input grandi e pulsante geolocalizzazione non invasivo.

## Tuning immagini e accessi contenuto
- Homepage: aggiunta immagine evento dinamica nel blocco "Di cosa vuoi parlare", con rotazione tra matrimonio, festa privata ed evento aziendale a ogni nuova visita.
- Homepage: sotto le tre conversazioni principali aggiunto pulsante "Vedi pi? articoli" per far capire subito che esiste altro contenuto da aprire.
- Guide: le schede della ricerca guide ora includono immagini coerenti con ogni pagina, evitando una lista solo testuale.
- Archivio guide: aggiunte miniature anche dentro le sezioni regionali, cos? le guide restano pi? riconoscibili.
- Mobile: immagini guide e blocco community restano impilati con altezze fisse, senza rompere il flusso di lettura.

## Tuning registrazione fornitori
- Registrazione fornitore trasformata in scheda di mappatura: attivit?, categoria, servizi, tipi evento, citt?, regione, zone coperte, fascia prezzo, budget minimo, raggio di lavoro, esperienza, portfolio e note.
- Dashboard fornitore aggiornata: la scheda pu? essere corretta dopo l'iscrizione e resta separata dal profilo cliente.
- Backend aggiornato: negli account fornitore sono visibili categoria, zone, eventi, fascia prezzo, budget minimo e link professionali.
- Privacy account: cancellando l'account vengono rimossi anche i campi di mappatura fornitore.
- Mobile: il form resta a sezioni impilate, con input grandi e checkbox chiare per mappare rapidamente i servizi.

## Tuning banner collaborazioni
- Desktop: banner orizzontale Vibes Planner limitato a larghezza massima 650 px nella pagina collaborazioni, con cornice leggera e angoli meno invadenti.
- Desktop: banner quadrato dentro la richiesta fornitori ridotto a colonna laterale da 9.5 rem, senza occupare troppo spazio rispetto al form.
- Mobile: il banner quadrato resta nascosto nelle conversazioni per non schiacciare il modulo e mantenere priorit? alla richiesta fornitori.
- Mobile: il banner collaborazioni resta centrato e non supera la larghezza dello schermo.
- Regola operativa: dopo ogni modifica visuale va aggiornato questo file con controllo separato desktop e mobile.

## Tuning Google Analytics
- Desktop: inserito Google tag globale con measurement ID G-M2BH2WMNV6 tramite Next Script, senza modifiche visive alle pagine.
- Mobile: stesso tag caricato dopo l'interazione, senza impatto su header, menu o layout smartphone.
- SEO/Privacy: aggiornata la privacy provvisoria con sezione statistiche e analytics.
- Configurazione: NEXT_PUBLIC_GA_MEASUREMENT_ID valorizzato nell'esempio env e fallback codice impostato su G-M2BH2WMNV6.
- Robustezza mobile/SPA: aggiunto componente GoogleAnalytics dedicato che invia un page_view anche quando l'utente cambia pagina senza refresh completo.
- PC/mobile: nessun impatto visivo; controllo da fare sempre su HTML pubblicato verificando gtag/js e gtag('config') con G-M2BH2WMNV6.

## Tuning SEO locale e AI visibility
- Desktop: aggiunto hub /fornitori-eventi con hero chiaro, schede ampie, archivio per regione e CTA Vibes tracciata ma non aggressiva.
- Desktop: aggiunte landing locali alla radice, per esempio /location-eventi-milano, con hero fotografico, casi tipici, checklist, FAQ, link interni e CTA fornitori.
- Desktop: homepage aggiornata con tre preview "Fornitori in zona" prima delle FAQ, cos? le nuove landing locali sono raggiungibili anche dall'utente e non solo dalla sitemap.
- Desktop/mobile: homepage resa robusta se il database non risponde; le sezioni statiche e SEO restano visibili invece di generare errore applicativo.
- Mobile: hub e landing restano in una sola colonna, con bottoni grandi, FAQ apribili e CTA posizionate dopo il contenuto utile, non prima.
- Mobile: il nuovo blocco "Fornitori in zona" si impila in tre card verticali con immagini grandi e testo breve.
- Mobile: le schede locali usano immagini grandi ma con altezza controllata, evitando blocchi infiniti o banner troppo invasivi.
- Mobile header: logo ridotto solo sotto breakpoint mobile e pulsanti "Domanda/Menu" compattati per eliminare overflow orizzontale senza togliere la CTA.
- SEO: /sitemap.xml ora e un indice sitemap; sono presenti sitemap separate per main, community, magazine, guide, regioni, province e categorie fornitori.
- SEO: aggiunta rewrite beforeFiles da /sitemap.xml a /sitemap-index.xml per evitare conflitti con vecchie route speciali del deploy Netlify.
- SEO: escluse dalle sitemap le aree private o non editoriali come login, dashboard, backend e API.
- AI: /llms.txt e /ai.txt aggiornati con hub fornitori, sitemap verticali, policy editoriali e note sui contenuti locali.
- AI: robots.txt lascia accessibili i contenuti pubblici a Googlebot, Bingbot, OAI-SearchBot e GPTBot, mantenendo chiuse aree private e API.
- Controllo qualit?: esportati file operativi in docs/seo-local con matrice, CTA, link interni, quality control, istruzioni Search Console, robots e landing markdown.
- Regola operativa: ogni nuovo batch mensile deve passare da quality_control.csv prima della pubblicazione, evitando pagine clone o doorway.

## Tuning lato fornitore
- Desktop: aggiunta pagina /fornitori con struttura verticale community-first: hero, passaggi, conversazioni da presidiare, scheda professionale, badge, collaborazione delicata e FAQ.
- Desktop: la pagina non usa banner aggressivi; il richiamo a Vibes Planner resta in un box editoriale con logo piccolo e testo neutro.
- Desktop: il mega menu "Parliamo di..." include un accesso discreto "Sei un fornitore", senza aggiungere una nuova voce pesante nell'header.
- Mobile: aggiunto link "Area fornitori" nel menu mobile, con descrizione breve e cliccabile.
- Mobile: pagina /fornitori progettata a colonna singola, con CTA grandi, blocchi leggibili e nessun recapito pubblico.
- SEO/AI: /fornitori aggiunta a sitemap main, llms.txt e ai.txt con canonical e JSON-LD WebPage/FAQ.

## Tuning immagini globale
- Creato file dedicato: docs/tuning-immagini-2026-06-14.md.
- Desktop: hero principali mantenuti emozionali ma con priorit? controllata; card, guide, magazine e banner alleggeriti.
- Mobile: immagini sotto la prima schermata caricate in lazy, con decoding asincrono e dimensioni pi? coerenti.
- Guide/SEO: immagini locali e regionali portate a parametri pi? performanti senza togliere resa editoriale.

## Tuning landing locali e immagini guide - 15 giugno 2026
- Desktop: rimosso dalle landing locali il box interno "Priorit? SEO / P1", sostituito con informazioni comprensibili per il cliente: cosa chiarire e come usare la pagina.
- Desktop: nelle card fornitori sostituito il badge tecnico di potenziale con "Guida locale".
- Desktop: aggiunte landing locali fornitori per Roma e Napoli, incluse /catering-eventi-roma e /musica-eventi-napoli.
- Desktop: guide regionali 2026/2027 aggiornate con immagini basate sul tema della guida, evitando la ripetizione della stessa foto architettonica su pi? card consecutive.
- Mobile: le nuove immagini restano dentro le altezze gi? stabilite; nessuna modifica ai flussi di click o alle CTA principali.
- SEO: build verificata con 1352 pagine generate; sitemap locali includono anche le nuove pagine Lazio e Campania.

## Tuning favicon e icone - 15 giugno 2026
- Desktop: icona del sito resa pi? grande ? leggibile nei tab, nei risultati di ricerca e nelle anteprime social.
- Desktop: metadata aggiornati per dichiarare favicon.ico, PNG 32x32, PNG 48x48 e PNG 512x512.
- Mobile: apple-touch-icon aggiornato a 180x180 e manifest aggiornato con icone 48, 192 e 512 px.
- UX: l'icona non usa pi? margini chiari eccessivi; il simbolo chat resta pieno anche quando viene mostrato molto piccolo.
- SEO: Google pu? richiedere tempo per aggiornare la favicon nei risultati, ma i file pubblici e dichiarati sono ora corretti.

## Tuning contrasto header e card evento - 15 giugno 2026
- Desktop: header reso pieno su fondo crema, senza trasparenza ambigua sopra immagini scure; le voci "Parliamo di..." e "Accedi" restano leggibili.
- Desktop: bottoni "Leggi le discussioni" nelle card evento con fondo bianco solido, ombra leggera e overlay foto pi? costante.
- Mobile: nessuna modifica alla struttura del menu; corrette solo classi colore/opacity per mantenere testi e bottoni leggibili.
- CSS/Tailwind: normalizzate opacita non standard come /92, /88, /58, /56, /35 e /15 verso valori generati correttamente.
