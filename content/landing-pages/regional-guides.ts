import type { LandingPage } from ".";

type RegionalProfile = {
  name: string;
  slug: string;
  center: { lat: number; lng: number };
  cities: string;
  mood: string;
  eventSignal2026: string;
  eventSignal2027: string;
  season: string;
  logistics: string;
  venues: string;
  suppliers: string;
  budgetWatch: string;
  localAngle: string;
  image: string;
  alt: string;
};

type RegionalTheme = {
  key: string;
  slug: string;
  eyebrow: string;
  eventType: string;
  title: (region: RegionalProfile) => string;
  meta: (region: RegionalProfile) => string;
  intent: string;
  firstAction: string;
  focus: string;
  ctaPrompt: string;
};

const updatedAt = "2026-06-14";

const regionalProfiles: RegionalProfile[] = [
  {
    name: "Abruzzo",
    slug: "abruzzo",
    center: { lat: 42.35, lng: 13.4 },
    cities: "Pescara, L'Aquila, Chieti, Teramo e borghi tra costa e Appennino",
    mood: "mare, montagna e borghi possono convivere nello stesso evento, ma chiedono tempi realistici",
    eventSignal2026: "calendari estivi adriatici, sagre diffuse e appuntamenti culturali nei borghi",
    eventSignal2027: "format outdoor, piccoli festival territoriali e weekend esperienziali da monitorare con largo anticipo",
    season: "Da maggio a settembre cresce la pressione su costa e terrazze panoramiche; in inverno pesano meteo e rientri",
    logistics: "Le distanze tra mare, collina e montagna sembrano brevi, ma bus e rientri vanno calcolati bene",
    venues: "Trabocchi, agriturismi, sale vista mare, borghi e rifugi accessibili",
    suppliers: "catering locale, musica, foto, transfer, allestimenti semplici e piano B meteo",
    budgetWatch: "transfer, piano B, riscaldamento o coperture, extra per orari serali",
    localAngle: "una guida abruzzese deve far scegliere prima atmosfera e stagione, poi il fornitore",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=78",
    alt: "Matrimonio all'aperto con invitati e palloncini"
  },
  {
    name: "Basilicata",
    slug: "basilicata",
    center: { lat: 40.64, lng: 15.8 },
    cities: "Matera, Potenza, Maratea, Melfi e borghi interni",
    mood: "scenari fortissimi e spazi piccoli richiedono una regia sobria, precisa e molto logistica",
    eventSignal2026: "eventi culturali e turistici legati a Matera, borghi, costa tirrenica e patrimonio locale",
    eventSignal2027: "viaggi evento lenti, weekend di destinazione e format intimi con forte identità territoriale",
    season: "Primavera e settembre funzionano bene; estate e borghi storici chiedono attenzione a caldo e accessi",
    logistics: "Scalini, ZTL, tempi su strada e pernottamenti non sono dettagli secondari",
    venues: "Sassi, masserie, terrazze, piccoli hotel, dimore rurali e spazi panoramici",
    suppliers: "catering territoriale, transfer, audio leggero, fotografo e personale di accoglienza",
    budgetWatch: "trasporto ospiti, montaggio in aree storiche, pernottamenti e servizio extra",
    localAngle: "in Basilicata vince l'evento con pochi elementi, ma tutti coerenti",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=78",
    alt: "Città storica del sud Italia al tramonto"
  },
  {
    name: "Calabria",
    slug: "calabria",
    center: { lat: 39.0, lng: 16.5 },
    cities: "Cosenza, Catanzaro, Crotone, Reggio Calabria, Tropea e costa ionica",
    mood: "mare, borghi e feste popolari danno energia, ma vento, caldo e rientri vanno messi nel piano",
    eventSignal2026: "Calabria Movie Film Festival a Crotone e Festa della Tarantella Calabrese sono segnali utili di calendario culturale 2026",
    eventSignal2027: "estate, folklore e format di destinazione continueranno a pesare su camere, transfer e weekend",
    season: "Giugno, luglio e settembre sono forti; agosto richiede più margine su fornitori e traffico",
    logistics: "Costa, entroterra e aeroporti possono essere lontani: il transfer va deciso prima del menù",
    venues: "lidi, terrazze sul mare, masserie, borghi e sale con spazi esterni",
    suppliers: "catering, musica popolare o DJ, transfer, foto, bar e piano caldo",
    budgetWatch: "transfer, bar, orari extra, camere ospiti e montaggio in location sul mare",
    localAngle: "la Calabria funziona quando l'evento sfrutta il territorio senza renderlo complicato",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=78",
    alt: "Costa mediterranea con mare e scogli"
  },
  {
    name: "Campania",
    slug: "campania",
    center: { lat: 40.85, lng: 14.78 },
    cities: "Napoli, Salerno, Caserta, Benevento, Avellino e Costiera",
    mood: "location scenografiche e ospitalità forte, ma traffico e orari possono cambiare tutta l'esperienza",
    eventSignal2026: "BMT Napoli e Hospitality Sud rendono Napoli un riferimento 2026 per turismo, hotellerie e fornitori",
    eventSignal2027: "la domanda su costiera, ville e destination event resta alta e va incrociata con ponti e stagione",
    season: "Maggio, giugno e settembre sono splendidi ma molto richiesti; dicembre pesa per cene aziendali e luci",
    logistics: "Costiera, centro storico e ville panoramiche chiedono parcheggi, navette e piani di rientro",
    venues: "ville, ristoranti vista mare, hotel, giardini, masserie e sale storiche",
    suppliers: "location, catering, musica, fotografo, bar, transfer e accoglienza ospiti",
    budgetWatch: "parcheggi, navette, extra vista mare, orari, camere e servizio al tavolo",
    localAngle: "in Campania la bellezza è già forte: il lavoro è togliere attriti agli ospiti",
    image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=78",
    alt: "Costa italiana con mare e case colorate"
  },
  {
    name: "Emilia-Romagna",
    slug: "emilia-romagna",
    center: { lat: 44.49, lng: 11.34 },
    cities: "Bologna, Parma, Modena, Ferrara, Ravenna, Rimini e Riviera",
    mood: "organizzazione, cibo e accoglienza sono punti forti: il rischio ? sottovalutare fiere e stagione balneare",
    eventSignal2026: "il calendario turistico regionale e gli appuntamenti MICE tra Riccione, Bologna e Riviera incidono su hotel e sale",
    eventSignal2027: "business event, food experience e feste sulla Riviera resteranno ricerche forti",
    season: "Primavera e autunno sono equilibrati; estate sulla Riviera cambia prezzi e disponibilità",
    logistics: "Fiera, stazione, autostrada, mare e colline creano scenari molto diversi",
    venues: "ristoranti, acetaie, hotel congressuali, stabilimenti, agriturismi e palazzi storici",
    suppliers: "catering, audio, sale meeting, allestimenti, DJ, foto e segreteria organizzativa",
    budgetWatch: "hotel, parcheggio, tecnica, coffee break, servizio e orari di sala",
    localAngle: "qui la guida deve aiutare a confrontare format molto diversi senza perdere concretezza",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=78",
    alt: "Tavola conviviale con persone durante un evento"
  },
  {
    name: "Friuli-Venezia Giulia",
    slug: "friuli-venezia-giulia",
    center: { lat: 46.07, lng: 13.23 },
    cities: "Trieste, Udine, Gorizia, Pordenone, Carso e costa",
    mood: "mare, confine, vento e cultura mitteleuropea rendono gli eventi eleganti ma logistici",
    eventSignal2026: "festival culturali, appuntamenti enogastronomici e turismo di confine spingono weekend selezionati",
    eventSignal2027: "eventi transfrontalieri, vino e format culturali restano temi da seguire",
    season: "Primavera e inizio autunno sono comodi; vento e meteo vanno considerati negli esterni",
    logistics: "Bora, strade del Carso e spostamenti tra città richiedono piano B e tempi larghi",
    venues: "ville, cantine, sale storiche, hotel, spazi vista mare e agriturismi",
    suppliers: "catering, vini, audio, transfer, fotografo e personale bilingue quando serve",
    budgetWatch: "servizio vino, transfer, riscaldamento, coperture e orari tecnici",
    localAngle: "la regione funziona quando il tono e preciso: meno scena, più cura",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=78",
    alt: "Paesaggio costiero e colline al tramonto"
  },
  {
    name: "Lazio",
    slug: "lazio",
    center: { lat: 41.9, lng: 12.48 },
    cities: "Roma, Viterbo, Latina, Rieti, Frosinone e castelli",
    mood: "Roma porta domanda, bellezza e vincoli: fuori città si trovano soluzioni più morbide ma da collegare",
    eventSignal2026: "calendario regionale 2026, FARETURISMO Roma e Festival delle Destinazioni segnalano forte attenzione a turismo e B2B",
    eventSignal2027: "continueranno a pesare destination event, incontri business e weekend culturali",
    season: "Primavera e autunno sono fortissimi; estate richiede piano caldo e spostamenti intelligenti",
    logistics: "ZTL, parcheggi, taxi, bus e distanze tra centro e ville cambiano il budget reale",
    venues: "palazzi, hotel, ville nei castelli, terrazze, sale meeting e agriturismi",
    suppliers: "location, catering, tecnica, hostess, transfer, foto, musica e sicurezza",
    budgetWatch: "permessi, transfer, extra centro storico, service audio e orari",
    localAngle: "nel Lazio l'evento deve partire dalla mappa prima che dal preventivo",
    image: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=1600&q=78",
    alt: "Roma con cupole e luce calda"
  },
  {
    name: "Liguria",
    slug: "liguria",
    center: { lat: 44.41, lng: 8.93 },
    cities: "Genova, Savona, Imperia, La Spezia, Portofino e Sestri Levante",
    mood: "mare e borghi sono magnetici, ma spazi stretti e parcheggi decidono la riuscita",
    eventSignal2026: "Discover Italy a Sestri Levante nel 2026 conferma il peso della Liguria per incoming e turismo esperienziale",
    eventSignal2027: "Discover Italy 2027 a Sestri Levante crea un segnale forte per operatori e territori",
    season: "Estate e settembre sono richiesti; primavera e ottobre possono essere più gestibili",
    logistics: "Strade strette, carico/scarico e parcheggio fornitori vanno chiariti subito",
    venues: "terrazze sul mare, hotel, conventi, giardini, stabilimenti e borghi",
    suppliers: "catering, transfer, bar, musica, foto, allestimenti leggeri e permessi",
    budgetWatch: "parcheggio, navette, montaggio, camere e piano pioggia",
    localAngle: "in Liguria vince chi progetta il movimento degli ospiti prima della scenografia",
    image: "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?auto=format&fit=crop&w=1600&q=78",
    alt: "Borgo ligure affacciato sul mare"
  },
  {
    name: "Lombardia",
    slug: "lombardia",
    center: { lat: 45.46, lng: 9.19 },
    cities: "Milano, Monza, Bergamo, Brescia, Como, Varese, Mantova e laghi",
    mood: "mercato veloce, budget alti e fornitori strutturati: la chiarezza arriva prima dello stile",
    eventSignal2026: "Milano-Cortina 2026, fiere e summit travel rendono il calendario lombardo molto competitivo",
    eventSignal2027: "BIT Milano 2027 conferma la centralita della regione per turismo, eventi e fornitori",
    season: "Autunno e periodo natalizio si riempiono presto; primavera e laghi hanno forte domanda",
    logistics: "Fiera, traffico, hotel, lago e centro città chiedono preventivi completi",
    venues: "hotel, rooftop, ville sui laghi, cascine, spazi industriali e sale congressi",
    suppliers: "service tecnico, catering, hostess, foto, transfer, allestimenti e security",
    budgetWatch: "tecnica, allestimenti, hotel, trasferimenti, extra lago e orari serali",
    localAngle: "in Lombardia il preventivo va analizzato voce per voce, senza farsi distrarre dal totale",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=78",
    alt: "Sala preparata per evento aziendale"
  },
  {
    name: "Marche",
    slug: "marche",
    center: { lat: 43.62, lng: 13.52 },
    cities: "Ancona, Pesaro, Urbino, Macerata, Ascoli Piceno e Riviera del Conero",
    mood: "costa, colline e città d'arte danno eventi caldi ma non caotici, se i tempi sono ben letti",
    eventSignal2026: "Summer Jamboree 2026 a Senigallia e i calendari costieri rendono alcuni weekend molto richiesti",
    eventSignal2027: "musica, mare, borghi e turismo lento restano chiavi forti per eventi esperienziali",
    season: "Estate e fine primavera sono richieste; settembre e ottobre danno alternative più morbide",
    logistics: "Conero, borghi e costa richiedono parcheggi, navette e orari compatibili",
    venues: "agriturismi, sale vista mare, palazzi storici, cantine e hotel sulla costa",
    suppliers: "catering, musica, foto, transfer, fiori, bar e allestimenti naturali",
    budgetWatch: "navette, camere, extra mare, piano B e servizio al tavolo",
    localAngle: "nelle Marche conta tenere insieme bellezza e semplicità di movimento",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=78",
    alt: "Colline italiane con luce morbida"
  },
  {
    name: "Molise",
    slug: "molise",
    center: { lat: 41.56, lng: 14.66 },
    cities: "Campobasso, Isernia, Termoli e borghi interni",
    mood: "gli eventi funzionano quando sono piccoli, chiari e legati al territorio",
    eventSignal2026: "borghi, costa di Termoli e appuntamenti locali rendono preziosi i weekend con camere disponibili",
    eventSignal2027: "format familiari, enogastronomia e turismo lento sono il terreno più interessante",
    season: "Estate sulla costa e autunno nei borghi hanno logiche diverse",
    logistics: "La disponibilità fornitori può essere più stretta: meglio chiedere presto e in modo ordinato",
    venues: "sale familiari, agriturismi, ristoranti, masserie e spazi vista mare",
    suppliers: "catering, musica, foto, transfer locale e allestimenti essenziali",
    budgetWatch: "trasferte fornitori, camere, orari e montaggio fuori zona",
    localAngle: "in Molise il valore sta nella misura: meno fornitori, più chiarezza",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=78",
    alt: "Evento serale con luci e persone"
  },
  {
    name: "Piemonte",
    slug: "piemonte",
    center: { lat: 45.07, lng: 7.69 },
    cities: "Torino, Novara, Alessandria, Langhe, Monferrato e laghi",
    mood: "eleganza, vino e spazi storici chiedono un preventivo ordinato e non solo romantico",
    eventSignal2026: "calendari culturali, fiere, vino e turismo di città spostano disponibilità in primavera e autunno",
    eventSignal2027: "Langhe, città d'arte e business event resteranno forti per weekend e meeting",
    season: "Primavera e vendemmia sono richieste; inverno può funzionare per eventi interni eleganti",
    logistics: "Collina, neve, ZTL e trasferte tra città cambiano tempi e costi",
    venues: "castelli, cantine, cascine, palazzi torinesi, hotel e sale aziendali",
    suppliers: "catering, vini, service, foto, transfer, allestimenti e personale sala",
    budgetWatch: "servizio vino, transfer, camere, riscaldamento e orari extra",
    localAngle: "in Piemonte si deve capire quanto territorio mettere nell'evento senza appesantirlo",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=78",
    alt: "Colline e vigneti in luce calda"
  },
  {
    name: "Puglia",
    slug: "puglia",
    center: { lat: 41.12, lng: 16.87 },
    cities: "Bari, Lecce, Brindisi, Taranto, Foggia, Valle d'Itria e Salento",
    mood: "masserie, mare e cene all'aperto sono desiderati, ma caldo e distanze vanno gestiti bene",
    eventSignal2026: "fiere turismo e forte domanda su masserie, wedding e destination event rendono i weekend competitivi",
    eventSignal2027: "masserie, borghi bianchi e turismo internazionale continueranno a spingere richieste di fornitori",
    season: "Giugno e settembre sono ideali; agosto richiede molta cura su caldo e disponibilità",
    logistics: "Distanze tra aeroporto, masseria, mare e hotel vanno scritte nel piano ospiti",
    venues: "masserie, trulli, corti, terrazze, lidi, hotel e giardini",
    suppliers: "catering, luminarie, musica, bar, transfer, foto e fiori",
    budgetWatch: "transfer, luminarie, bar, camere, piano caldo e orari extra",
    localAngle: "in Puglia l'effetto wow ce già: serve far funzionare il viaggio degli ospiti",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=78",
    alt: "Architettura mediterranea bianca"
  },
  {
    name: "Sardegna",
    slug: "sardegna",
    center: { lat: 40.12, lng: 9.01 },
    cities: "Cagliari, Sassari, Olbia, Alghero, Oristano e costa",
    mood: "mare e vento danno atmosfera, ma traghetti, voli e camere possono pesare più del menù",
    eventSignal2026: "turismo estivo, festival locali e domanda su costa rendono decisive camere e transfer",
    eventSignal2027: "destination event e feste private al mare saranno forti nei mesi spalla",
    season: "Giugno e settembre spesso sono più equilibrati di agosto",
    logistics: "Voli, traghetti, noleggi e rientri serali vanno chiariti prima della location",
    venues: "lidi, resort, agriturismi, ville, terrazze sul mare e cantine",
    suppliers: "catering, bar, transfer, foto, musica, allestimenti vento-friendly",
    budgetWatch: "pernottamenti, transfer, trasporto materiali, piano vento e orari serali",
    localAngle: "in Sardegna una guida deve far pensare come ospite prima che come organizzatore",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=78",
    alt: "Mare limpido e costa mediterranea"
  },
  {
    name: "Sicilia",
    slug: "sicilia",
    center: { lat: 37.6, lng: 14.02 },
    cities: "Palermo, Catania, Messina, Siracusa, Trapani, Ragusa e Taormina",
    mood: "eventi ricchi di identità, ma distanze, caldo e tempi reali vanno accettati",
    eventSignal2026: "Taobuk Festival a Taormina e calendari fieristici regionali segnalano domanda culturale e turistica forte",
    eventSignal2027: "destination wedding, festival, enogastronomia e turismo internazionale resteranno centrali",
    season: "Primavera, giugno e settembre sono forti; luglio e agosto richiedono piano caldo serio",
    logistics: "Aeroporti, isole, coste e borghi possono allungare molto i tempi",
    venues: "bagli, ville, palazzi, terrazze, lidi, cantine e hotel storici",
    suppliers: "catering, musica, bar, fiori, foto, transfer e accoglienza ospiti",
    budgetWatch: "transfer, camere, allestimenti, bar, extra caldo e montaggio",
    localAngle: "in Sicilia la forza e l'atmosfera: la guida deve proteggere tempi e comfort",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=78",
    alt: "Borgo siciliano e mare in estate"
  },
  {
    name: "Toscana",
    slug: "toscana",
    center: { lat: 43.77, lng: 11.25 },
    cities: "Firenze, Siena, Pisa, Lucca, Arezzo, Maremma e Val d'Orcia",
    mood: "ville, arte e campagna sono desideratissime: il rischio ? prenotare bellezza senza leggere vincoli",
    eventSignal2026: "calendario ufficiale Visit Tuscany e Festival delle Regioni 2026 confermano un anno denso di turismo e eventi",
    eventSignal2027: "ville, wine event, destination wedding e borghi resteranno parole chiave forti",
    season: "Maggio, giugno e settembre sono molto richiesti; ottobre funziona per vino e corporate",
    logistics: "Strade bianche, ZTL, bus, camere e orari musica vanno chiariti in anticipo",
    venues: "ville, tenute, cantine, agriturismi, palazzi storici e giardini",
    suppliers: "catering, fiori, musica, foto, luci, transfer e wedding/event planner",
    budgetWatch: "affitto location, camere, transfer, extra orari, service e piano B",
    localAngle: "in Toscana serve distinguere la villa bella dalla villa gestibile",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=78",
    alt: "Collina toscana con cipressi"
  },
  {
    name: "Trentino-Alto Adige",
    slug: "trentino-alto-adige",
    center: { lat: 46.5, lng: 11.35 },
    cities: "Trento, Bolzano, Riva del Garda, Merano, valli e Dolomiti",
    mood: "montagna, lago e hotel di qualità danno eventi memorabili ma dipendenti dal meteo",
    eventSignal2026: "Hospitality a Riva del Garda e Milano-Cortina 2026 influenzano ricettivita, operatori e calendario",
    eventSignal2027: "wellness, montagna e meeting esperienziali resteranno ricerche forti",
    season: "Estate e inverno hanno esigenze opposte: piano meteo e camere sono prioritari",
    logistics: "Neve, passi, lago, impianti e rientri serali cambiano tutto",
    venues: "hotel, rifugi, cantine, sale congressi, giardini e spazi vista lago",
    suppliers: "catering, audio, transfer, foto, attività outdoor e hospitality",
    budgetWatch: "camere, transfer, meteo, attività, permessi e service tecnico",
    localAngle: "qui l'evento deve avere un piano A bellissimo e un piano B altrettanto dignitoso",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=78",
    alt: "Montagne e valle al tramonto"
  },
  {
    name: "Umbria",
    slug: "umbria",
    center: { lat: 43.11, lng: 12.39 },
    cities: "Perugia, Assisi, Todi, Spoleto, Orvieto e borghi",
    mood: "spiritualita, borghi e campagna funzionano quando l'evento resta umano",
    eventSignal2026: "World Tourism Event 2026 ad Assisi conferma attenzione su patrimonio, sostenibilita e incoming",
    eventSignal2027: "borghi, cammini, eventi culturali e turismo lento restano temi forti",
    season: "Primavera e inizio autunno sono ideali; estate nei borghi richiede piano caldo",
    logistics: "Strade interne, parcheggi e pernottamenti vanno progettati prima degli allestimenti",
    venues: "casali, conventi, dimore storiche, giardini, cantine e sale panoramiche",
    suppliers: "catering, musica acustica, foto, transfer, fiori e accoglienza",
    budgetWatch: "pernottamenti, transfer, piano B, orari musica e personale",
    localAngle: "in Umbria l'evento non deve sembrare costruito: deve sembrare inevitabile",
    image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=78",
    alt: "Borgo italiano in collina"
  },
  {
    name: "Valle d'Aosta",
    slug: "valle-d-aosta",
    center: { lat: 45.74, lng: 7.32 },
    cities: "Aosta, Courmayeur, Cervinia, Saint-Vincent e vallate",
    mood: "montagna e dimensione raccolta chiedono eventi intimi, caldi e molto preparati",
    eventSignal2026: "stagioni neve, outdoor e turismo alpino rendono camere e transfer decisivi",
    eventSignal2027: "micro-eventi esperienziali, retreat e feste intime continueranno a crescere",
    season: "Inverno ed estate sono forti ma completamente diversi; le mezze stagioni vanno valutate bene",
    logistics: "Meteo, strade, quota, neve e ospiti da fuori vanno messi al centro",
    venues: "hotel alpini, chalet, rifugi accessibili, sale vista montagna e spa",
    suppliers: "catering, transfer, audio, foto, allestimenti caldi e personale accoglienza",
    budgetWatch: "camere, transfer, meteo, riscaldamento, permessi e orari",
    localAngle: "in Valle d'Aosta l'evento deve proteggere comfort e sicurezza prima dell'effetto scenico",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=78",
    alt: "Montagne innevate e valle alpina"
  },
  {
    name: "Veneto",
    slug: "veneto",
    center: { lat: 45.44, lng: 12.33 },
    cities: "Venezia, Verona, Padova, Treviso, Vicenza, Dolomiti e lago",
    mood: "ville, acqua, fiere e turismo internazionale rendono il Veneto ricco ma pieno di variabili",
    eventSignal2026: "Milano-Cortina 2026 e gli appuntamenti fieristici mettono pressione su ospitalità, transfer e fornitori",
    eventSignal2027: "fiere, ville venete, laghi e città d'arte resteranno centrali per eventi e matrimoni",
    season: "Primavera e settembre sono richiesti; Venezia e lago hanno logiche proprie",
    logistics: "Acqua, ZTL, parcheggi, ville in campagna e hotel possono cambiare il budget",
    venues: "ville venete, palazzi, hotel, cantine, spazi congressuali e terrazze",
    suppliers: "catering, service, transfer, barche quando servono, foto e allestimenti",
    budgetWatch: "trasporti, permessi, camere, service tecnico, orari e piano meteo",
    localAngle: "in Veneto bisogna capire se stai organizzando un evento di città, villa, lago o montagna",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=78",
    alt: "Canale veneziano con palazzi storici"
  }
];

const regionalThemes: RegionalTheme[] = [
  {
    key: "matrimoni",
    slug: "matrimoni-2026-2027",
    eyebrow: "Matrimoni 2026/2027",
    eventType: "Matrimonio",
    title: (region) => `Matrimoni in ${region.name} nel 2026 e 2027: dove iniziare davvero`,
    meta: (region) => `Guida unica per matrimoni in ${region.name} nel 2026 e 2027: location, fornitori, stagioni, budget, errori e domande da fare.`,
    intent: "Scegliere location, stagione e fornitori senza rincorrere preventivi casuali",
    firstAction: "decidere atmosfera, periodo e numero ospiti prima di contattare le location",
    focus: "matrimonio",
    ctaPrompt: "Sto organizzando un matrimonio: cosa devo bloccare per primo?"
  },
  {
    key: "feste-private",
    slug: "feste-private-2026-2027",
    eyebrow: "Feste private 2026/2027",
    eventType: "Compleanni e feste private",
    title: (region) => `Feste private in ${region.name}: idee, budget e fornitori per il 2026/2027`,
    meta: (region) => `Come organizzare feste private in ${region.name}: compleanni, lauree, anniversari, location, musica, catering e budget.`,
    intent: "Creare una festa bella ma gestibile, senza trasformarla in un mini matrimonio",
    firstAction: "scegliere formato, orario e livello di servizio prima del tema",
    focus: "festa privata",
    ctaPrompt: "Sto organizzando una festa privata: meglio sala, ristorante o casa?"
  },
  {
    key: "aziendali",
    slug: "eventi-aziendali-2026-2027",
    eyebrow: "Eventi aziendali 2026/2027",
    eventType: "Evento aziendale",
    title: (region) => `Eventi aziendali in ${region.name}: format concreti per 2026 e 2027`,
    meta: (region) => `Guida per eventi aziendali in ${region.name}: cene, meeting, team building, location, logistica, fornitori e budget.`,
    intent: "Organizzare un evento utile, chiaro e non noioso",
    firstAction: "scrivere l'obiettivo dell'evento prima di scegliere la location",
    focus: "evento aziendale",
    ctaPrompt: "Evento aziendale: come lo rendo utile e non solo formale?"
  },
  {
    key: "preventivi-fornitori",
    slug: "preventivi-fornitori-2026-2027",
    eyebrow: "Preventivi e fornitori",
    eventType: "Preventivo",
    title: (region) => `Preventivi evento in ${region.name}: cosa controllare nel 2026/2027`,
    meta: (region) => `Come leggere preventivi evento in ${region.name}: voci incluse, extra, caparre, fornitori, condizioni e confronto con casi simili.`,
    intent: "Capire se un preventivo è completo o solo bello da leggere",
    firstAction: "dividere il preventivo in inclusi, extra, condizioni e punti da chiarire",
    focus: "preventivo evento",
    ctaPrompt: "Ho ricevuto un preventivo: quali voci devo controllare?"
  },
  {
    key: "idée-locali",
    slug: "idee-evento-locali-2026-2027",
    eyebrow: "Idee evento locali",
    eventType: "Idee evento",
    title: (region) => `Idee evento in ${region.name}: format locali da rendere semplici`,
    meta: (region) => `Idee evento in ${region.name} per 2026 e 2027: format locali, esperienze, budget, logistica e domande da fare.`,
    intent: "Trovare un'idea con identità locale che resti facile da organizzare",
    firstAction: "scegliere una promessa semplice: cosa devono ricordare gli ospiti",
    focus: "idea evento",
    ctaPrompt: "Vorrei un'idea evento originale ma realizzabile: da dove parto?"
  }
];

const regionalThemeVisuals: Record<string, Array<{ image: string; alt: string }>> = {
  matrimoni: [
    {
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=78",
      alt: "Matrimonio all'aperto con invitati e palloncini"
    },
    {
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=78",
      alt: "Dettaglio elegante di bouquet e abito da sposa"
    },
    {
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=78",
      alt: "Tavola preparata per ricevimento di matrimonio"
    },
    {
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=78",
      alt: "Cerimonia di matrimonio in una location elegante"
    },
    {
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=78",
      alt: "Dettaglio romantico per ricevimento di nozze"
    }
  ],
  "feste-private": [
    {
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=78",
      alt: "Festa privata con brindisi e luci calde"
    },
    {
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=78",
      alt: "Palloncini colorati per festa privata"
    },
    {
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=78",
      alt: "Persone che brindano durante una festa"
    },
    {
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=78",
      alt: "Festa serale con luci e persone"
    },
    {
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=78",
      alt: "Evento serale con musica e atmosfera"
    }
  ],
  aziendali: [
    {
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=78",
      alt: "Sala conferenza preparata per evento aziendale"
    },
    {
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=78",
      alt: "Team aziendale durante un workshop"
    },
    {
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=78",
      alt: "Sala conferenza preparata per evento aziendale"
    },
    {
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=78",
      alt: "Riunione di lavoro con persone al tavolo"
    },
    {
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=78",
      alt: "Gruppo di lavoro durante una sessione aziendale"
    }
  ],
  "preventivi-fornitori": [
    {
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=78",
      alt: "Preventivo e calcolo budget per evento"
    },
    {
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=78",
      alt: "Documenti e condizioni da controllare"
    },
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=78",
      alt: "Persona che confronta un preventivo al computer"
    },
    {
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1600&q=78",
      alt: "Pianificazione evento con calendario e appunti"
    },
    {
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=78",
      alt: "Accordo professionale tra cliente e fornitore"
    }
  ],
  "idée-locali": [
    {
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=78",
      alt: "Cena conviviale con ospiti durante un evento"
    },
    {
      image: "https://images.unsplash.com/photo-1524777313293-86d2ab467344?auto=format&fit=crop&w=1600&q=78",
      alt: "Allestimento creativo per idea evento"
    },
    {
      image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=78",
      alt: "Location accogliente per evento privato"
    },
    {
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=78",
      alt: "Evento serale con musica e atmosfera creativa"
    },
    {
      image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=78",
      alt: "Persone riunite durante un evento informale"
    }
  ]
};

function regionalVisual(theme: RegionalTheme, regionIndex: number, themeIndex: number) {
  const pool = regionalThemeVisuals[theme.key] ?? regionalThemeVisuals.matrimoni;
  return pool[(regionIndex + themeIndex) % pool.length];
}

function regionalTitle(theme: RegionalTheme, region: RegionalProfile) {
  return theme.title(region);
}

function regionalPage(region: RegionalProfile, theme: RegionalTheme, regionIndex: number, themeIndex: number): LandingPage {
  const title = regionalTitle(theme, region);
  const readingMinutes = 8 + ((regionIndex + themeIndex) % 4);
  const questionBase = theme.focus === "preventivo evento" ? "preventivo" : theme.focus;
  const visual = regionalVisual(theme, regionIndex, themeIndex);

  return {
    slug: `${theme.slug}-${region.slug}`,
    status: "published",
    guideType: "regional",
    regionSlug: region.slug,
    coordinates: region.center,
    yearFocus: "2026/2027",
    searchTags: [region.name, theme.eventType, theme.focus, "2026", "2027", "fornitori", "budget"],
    sourceSummary: `${region.eventSignal2026}. ${region.eventSignal2027}.`,
    title,
    metaTitle: title.length > 62 ? `${theme.eventType} in ${region.name} 2026/2027` : title,
    metaDescription: theme.meta(region),
    eyebrow: theme.eyebrow,
    eventType: theme.eventType,
    city: region.cities.split(",")[0] ?? region.name,
    region: region.name,
    heroImage: visual.image,
    heroAlt: visual.alt,
    intro: `${region.name} non è una regione da trattare con una guida generica: ${region.mood}. Questa pagina parte dai segnali 2026 e 2027, ma li traduce in scelte pratiche per ${theme.focus}, fornitori, budget e domande da fare prima di bloccare una data.`,
    updatedAt,
    readingMinutes,
    quickFacts: [
      { label: "Area", value: region.cities },
      { label: "Focus", value: theme.intent },
      { label: "Segnale 2026", value: region.eventSignal2026 },
      { label: "Geolocalizzazione", value: `${region.center.lat.toFixed(2)}, ${region.center.lng.toFixed(2)}` }
    ],
    sections: [
      {
        title: `Perché una guida ${region.name} 2026/2027 deve essere locale`,
        body: `Organizzare un ${questionBase} in ${region.name} significa leggere insieme territorio, stagione e disponibilità. ${region.season}. Se copi una scaletta pensata per un'altra regione rischi di sbagliare priorità: qui contano soprattutto ${region.logistics}.`,
        bullets: [
          `Zona da considerare: ${region.cities}.`,
          `Identità utile: ${region.localAngle}.`,
          "Prima di scegliere il fornitore, chiarisci data, ospiti, spostamenti e piano B."
        ]
      },
      {
        title: `Eventi 2026 e 2027: come usarli senza farsi travolgere`,
        body: `${region.eventSignal2026}. Guardando al 2027, ${region.eventSignal2027}. Questi segnali non servono per copiare un evento già esistente, ma per capire quando hotel, location, tecnici e fornitori possono essere più richiesti.`,
        bullets: [
          "Controlla se la data scelta cade vicino a fiere, festival, ponti o grandi flussi turistici.",
          "Chiedi ai fornitori se in quel periodo lavorano già su eventi grandi o ripetuti.",
          "Se hai ospiti da fuori, blocca camere e transfer prima degli allestimenti."
        ]
      },
      {
        title: `Il primo passo per ${theme.focus} in ${region.name}`,
        body: `Il primo passo non è chiedere un prezzo: e ${theme.firstAction}. Solo dopo ha senso confrontare ${region.venues}. In questo modo capisci se stai cercando un evento intimo, conviviale, aziendale, scenografico o semplicemente facile da vivere.`,
        bullets: [
          "Scrivi una richiesta uguale per tutti i fornitori.",
          "Chiedi sempre cosa è incluso, cosa ? extra e cosa cambia se aumentano gli ospiti.",
          "Non confrontare brochure diverse: confronta voci uguali."
        ]
      },
      {
        title: "Fornitori: cosa chiedere prima di fidarsi",
        body: `In ${region.name} i fornitori chiave sono spesso ${region.suppliers}. Là parte delicata e ${region.budgetWatch}. Una risposta vaga non è per forza un problema, ma va chiarita prima di versare caparre o comunicare la data agli ospiti.`,
        bullets: [
          "Chi sarà presente il giorno dell'evento",
          "Cosa succede se meteo, ritardi o numero ospiti cambiano?",
          "Entro quando devo dare conferma definitiva e saldo?"
        ]
      },
      {
        title: "Budget: la voce nascosta non è sempre nel menù",
        body: `Il budget di un evento regionale cambia spesso per logistica, personale, durata e vincoli della location. In ${region.name}, ${region.logistics}. Per questo una guida seria deve parlare di esperienza ospiti e non solo di décorazioni.`,
        bullets: [
          "Metti un margine per trasporto, montaggio, pulizie, orari e servizio.",
          "Se la location è bellissima ma scómoda, calcola cosa costa renderla cómoda.",
          "Se il preventivo non separa le voci, chiedi una versione leggibile."
        ]
      },
      {
        title: "Come trasformare la guida in una conversazione utile",
        body: `Quando hai un caso reale, non pubblicare nomi di fornitori o dati personali. Scrivi regione, zona, tipo evento, numero persone, budget indicativo e il dubbio principale. La community può aiutarti meglio se vede il problema, non se deve indovinarlo.`,
        bullets: [
          `Esempio: "${theme.ctaPrompt}"`,
          "Aggiungi foto solo se non contiene dati personali e accetti revisione.",
          "Aggiorna la conversazione quando ricevi nuove risposte o scegli una strada."
        ]
      }
    ],
    checklist: [
      `Scegli se il tuo ${questionBase} deve essere comodo, scenografico, intimo o aziendale.`,
      `Controlla calendario 2026/2027 in ${region.name} prima di bloccare data e camere.`,
      `Chiedi preventivi per ${region.suppliers}.`,
      `Metti per iscritto ${region.budgetWatch}.`,
      "Prepara un piano B per meteo, ritardi e cambio numero ospiti.",
      "Apri una conversazione se due preventivi sembrano simili ma hanno voci diverse."
    ],
    mistakes: [
      "Usare una guida nazionale senza adattarla a regione, stagione e spostamenti.",
      "Scegliere una location bella ma difficile da raggiungere senza calcolare transfer e camere.",
      "Pensare che un evento 2026/2027 sia lontano abbastanza da poter rimandare tutto.",
      "Chiedere prezzi senza indicare zona, orario, numero persone e servizi richiesti.",
      "Pubblicare nomi o accuse sui fornitori invece di chiedere un parere neutro."
    ],
    communityPrompts: [
      `${theme.ctaPrompt} Sono in ${region.name} e ho già una data indicativa.`,
      `Quali extra devo controllare per un ${questionBase} in ${region.name}?`,
      `Meglio puntare su ${region.venues.split(",")[0]} o su una soluzione più semplice`,
      `Ho due preventivi in ${region.name}: come li confronto senza farmi confondere?`
    ],
    faqs: [
      {
        question: `Questa guida vale per tutta la ${region.name}?`,
        answer: `Si, ma va adattata alla zona: ${region.cities}. Le differenze tra città, costa, borghi e aree interne possono cambiare logistica e budget.`
      },
      {
        question: "Perché parlare già di 2026 e 2027",
        answer: "Perché fiere, festival, turismo, ponti ? alta stagione possono bloccare camere, location e fornitori molto prima di quanto sembri."
      },
      {
        question: "Come uso la geolocalizzazione nella sezione guide?",
        answer: "Nella pagina guide puoi usare la posizione per filtrare la regione più vicina e leggere prima i contenuti locali."
      },
      {
        question: "Posso chiedere aiuto senza registrarmi?",
        answer: "Sì. Puoi leggere e fare una domanda senza registrazione obbligatoria. L'iscrizione serve solo se vuoi dashboard, badge e gestione profilo."
      }
    ],
    relatedLinks: [
      { href: `/fai-domanda?titolo=${encodeURIComponent(theme.ctaPrompt)}`, label: "Apri una conversazione", description: "Racconta il tuo caso alla community." },
      { href: "/analizza-preventivo", label: "Analizza il preventivo", description: "Trasforma voci e dubbi in una discussione chiara." },
      { href: "/trova-fornitori", label: "Trova fornitori", description: "Richiedi supporto privato se vuoi essere aiutato." }
    ]
  };
}

export const regionalLandingPages: LandingPage[] = regionalProfiles.flatMap((region, regionIndex) =>
  regionalThemes.map((theme, themeIndex) => regionalPage(region, theme, regionIndex, themeIndex))
);
