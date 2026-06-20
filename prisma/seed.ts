import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "../lib/constants";
import { slugify } from "../lib/slug";

const prisma = new PrismaClient();

const questions = [
  {
    title: "DJ per diciottesimo: 80 invitati, 5 ore e luci base",
    categorySlug: "quanto-costa",
    postType: "Quanto costa",
    eventType: "Diciottesimo",
    city: "Roma",
    region: "Lazio",
    peopleCount: 80,
    budgetRange: "500-900 euro",
    content:
      "Sto organizzando un diciottesimo in una sala privata. Vorrei capire quanto mettere a budget per DJ, impianto e luci senza prendere una fregatura.",
    usefulVotes: 18,
    answers: [
      "Per 80 persone in una città grande io ho visto preventivi tra 500 e 800 euro, spesso con impianto incluso. Chiedi sempre orario preciso, eventuali extra dopo mezzanotte e se le luci sono comprese.",
      "Controlla anche chi gestisce la SIAE. Alcuni DJ la citano ma non la includono. Fatti mandare una scaletta dei servizi e chiedi video di eventi simili."
    ]
  },
  {
    title: "Buffet per 50 invitati: stesso menu, due prezzi lontanissimi",
    categorySlug: "catering-menu",
    postType: "Quanto costa",
    eventType: "Cena privata",
    city: "Bologna",
    region: "Emilia-Romagna",
    peopleCount: 50,
    budgetRange: "1.500-3.500 euro",
    content:
      "Mi serve un catering semplice per una festa privata: buffet salato, torta e forse un piccolo open bar. Che cifra realistica devo aspettarmi?",
    usefulVotes: 22,
    answers: [
      "Per un buffet semplice calcola 25-40 euro a persona. Se aggiungi servizio, attrezzature, trasporto e torta puoi arrivare facilmente a 50-60 euro a persona.",
      "Chiedi un preventivo separato per cibo, personale, noleggio tavoli e bevande. Così capisci dove puoi tagliare senza rovinare la serata."
    ]
  },
  {
    title: "Meglio villa o ristorante per un compleanno elegante?",
    categorySlug: "location",
    postType: "Domanda",
    eventType: "Compleanno",
    city: "Firenze",
    region: "Toscana",
    peopleCount: 60,
    budgetRange: "4.000 euro",
    content:
      "Vorrei fare un compleanno elegante per i 40 anni. La villa è più scenografica, ma temo costi extra e organizzazione più complicata.",
    usefulVotes: 14,
    answers: [
      "Il ristorante è più semplice perché spesso include cucina, personale e pulizie. La villa conviene se vuoi personalizzare molto, ma somma catering, allestimenti, bagni, sicurezza e pulizie.",
      "Visita entrambe con una lista: orari, parcheggio, piano pioggia, audio, caparra, penali e cosa succede se sfori con l'orario."
    ]
  },
  {
    title: "Come faccio a capire se un preventivo per una location è troppo alto?",
    categorySlug: "location",
    postType: "Preventivo",
    eventType: "Festa privata",
    city: "Milano",
    region: "Lombardia",
    peopleCount: 100,
    budgetRange: "2.000-3.000 euro solo spazio",
    content:
      "Ho ricevuto un preventivo solo affitto spazio e mi sembra alto. Non so quali voci confrontare con altre location.",
    usefulVotes: 16,
    answers: [
      "Non guardare solo il prezzo finale. Chiedi se include pulizie, sicurezza, tecnico audio, arredi, guardaroba, riscaldamento, ore extra e IVA.",
      "Fatti fare almeno tre preventivi con lo stesso numero di persone e gli stessi orari. Se uno costa molto di più deve avere servizi chiari inclusi."
    ]
  },
  {
    title: "Quanto anticipo serve per prenotare una location per matrimonio?",
    categorySlug: "matrimoni",
    postType: "Domanda",
    eventType: "Matrimonio",
    city: "Napoli",
    region: "Campania",
    peopleCount: 120,
    budgetRange: "Da definire",
    content:
      "Ci sposiamo l'anno prossimo e non sappiamo se siamo già in ritardo. Le location più belle sembrano avere poche date libere.",
    usefulVotes: 21,
    answers: [
      "Per sabati tra maggio e settembre meglio muoversi 12-18 mesi prima. Se accetti venerdì, domenica o bassa stagione trovi più margine.",
      "Blocca la location solo dopo aver capito capienza reale, piano pioggia, orario fine evento e condizioni di recesso."
    ]
  },
  {
    title: "Cosa devo chiedere a un catering prima di confermare?",
    categorySlug: "catering-menu",
    postType: "Domanda",
    eventType: "Matrimonio",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 90,
    budgetRange: "70-95 euro a persona",
    content:
      "Abbiamo due preventivi simili per il catering, ma non sappiamo quali domande fare prima di versare la caparra.",
    usefulVotes: 17,
    answers: [
      "Chiedi prova menu, numero camerieri, gestione intolleranze, orari, costo bimbi, bevande, torta, attrezzature, trasporto e cosa succede se cambiano gli invitati.",
      "Fatti scrivere tutto nel contratto: menu definitivo, numero minimo garantito, penali, saldo e tempi per comunicare il numero finale."
    ]
  },
  {
    title: "Cena aziendale a Padova: il prezzo sembra ok, ma cosa resta fuori?",
    categorySlug: "eventi-aziendali",
    postType: "Quanto costa",
    eventType: "Evento aziendale",
    city: "Padova",
    region: "Veneto",
    peopleCount: 45,
    budgetRange: "2.500-4.500 euro",
    content:
      "Devo proporre un budget per una cena aziendale di fine anno, con menu completo e magari un piccolo intrattenimento.",
    usefulVotes: 19,
    answers: [
      "Per cena seduta in ristorante calcola 45-80 euro a persona, bevande escluse o con pacchetto. Aggiungi eventuale sala privata, microfono, musica o transfer.",
      "Se vuoi stare sotto budget, scegli menu fisso con bevande incluse e limita gli extra dopo cena. Le sorprese arrivano quasi sempre dal beverage."
    ]
  },
  {
    title: "Come funziona la SIAE per una festa privata?",
    categorySlug: "musica-dj",
    postType: "Burocrazia",
    eventType: "Festa privata",
    city: "Bari",
    region: "Puglia",
    peopleCount: 70,
    budgetRange: "Non so",
    content:
      "Avremo un DJ in una sala in affitto. La location mi ha detto di occuparmi io della SIAE, ma non so da dove iniziare.",
    usefulVotes: 15,
    answers: [
      "Chiedi alla location se ha già una procedura abituale. Di solito devi indicare data, luogo, numero invitati, tipo evento e musica dal vivo o registrata.",
      "Non aspettare l'ultima settimana. Fatti aiutare dal DJ per il programma musicale, ma verifica tu il permesso e conserva la ricevuta."
    ]
  },
  {
    title: "Se piove e ho scelto una location all'aperto, cosa devo prevedere?",
    categorySlug: "location",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Perugia",
    region: "Umbria",
    peopleCount: 110,
    budgetRange: "Da definire",
    content:
      "La location ha un giardino bellissimo, ma il piano B non mi convince. Cosa devo controllare prima di firmare?",
    usefulVotes: 24,
    answers: [
      "Chiedi di vedere fisicamente il piano B allestito, non solo descritto. Deve contenere tutti gli invitati seduti, buffet, musica e passaggi camerieri.",
      "Verifica quando si decide il cambio piano e chi paga eventuali tensostrutture. Se il piano B ti sembra un ripiego, continua a cercare."
    ]
  },
  {
    title: "Come evitare fregature con un DJ?",
    categorySlug: "musica-dj",
    postType: "Problema",
    eventType: "Compleanno",
    city: "Genova",
    region: "Liguria",
    peopleCount: 55,
    budgetRange: "400-700 euro",
    content:
      "Ho trovato DJ con prezzi molto diversi. Vorrei capire quali segnali guardare prima di confermare.",
    usefulVotes: 20,
    answers: [
      "Chiedi contratto, orari, cosa include l'impianto, piano in caso di malattia e video di eventi veri. Diffida da chi non mette nulla per iscritto.",
      "Parla anche di musica che non vuoi. Un DJ bravo capisce il pubblico, non mette solo la sua playlist preferita."
    ]
  },
  {
    title: "La location mi chiede una caparra alta, è normale?",
    categorySlug: "problemi-fornitori",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Verona",
    region: "Veneto",
    peopleCount: 100,
    budgetRange: "Caparra 40%",
    content:
      "La location chiede il 40% alla firma. Mi sembra tanto e ho paura di perdere tutto se cambiano i piani.",
    usefulVotes: 13,
    answers: [
      "Una caparra importante può capitare, ma devi leggere bene condizioni di annullamento, cambio data e saldo. Chiedi se è caparra confirmatoria o acconto.",
      "Se hai dubbi, proponi una divisione in più tranche legate a scadenze precise. Un fornitore serio te lo spiega senza pressioni."
    ]
  },
  {
    title: "Idee per un compleanno adulto diverso dal solito?",
    categorySlug: "idee-evento",
    postType: "Idea",
    eventType: "Compleanno",
    city: "Roma",
    region: "Lazio",
    peopleCount: 35,
    budgetRange: "1.500 euro",
    content:
      "Non voglio la classica cena lunga. Cerco qualcosa di semplice ma memorabile per un gruppo di amici tra 35 e 45 anni.",
    usefulVotes: 12,
    answers: [
      "Potresti fare aperitivo con degustazione guidata, cena itinerante in tre locali vicini o laboratorio cocktail con barman. Sono format leggeri e fanno parlare gli ospiti.",
      "Se il gruppo è attivo, anche escape room più cena o mini torneo con premiazione funziona bene. Tieni sempre una parte conviviale finale."
    ]
  },
  {
    title: "Idee per una cena aziendale non noiosa?",
    categorySlug: "eventi-aziendali",
    postType: "Idea",
    eventType: "Evento aziendale",
    city: "Milano",
    region: "Lombardia",
    peopleCount: 65,
    budgetRange: "5.000 euro",
    content:
      "Vorremmo evitare la solita cena con discorsi lunghi. Serve qualcosa di piacevole ma non imbarazzante per i colleghi.",
    usefulVotes: 11,
    answers: [
      "Funzionano bene quiz a squadre leggeri, degustazione con tavoli misti o cena con piccoli momenti di premiazione. Eviterei attività troppo fisiche o obbligatorie.",
      "Taglia i discorsi a massimo 10 minuti totali e metti un moderatore. La cena migliora subito."
    ]
  },
  {
    title: "Band per matrimonio: il preventivo cambia appena aggiungo il DJ",
    categorySlug: "musica-dj",
    postType: "Quanto costa",
    eventType: "Matrimonio",
    city: "Lecce",
    region: "Puglia",
    peopleCount: 130,
    budgetRange: "1.200-3.000 euro",
    content:
      "Vorremmo musica live per aperitivo e festa dopo cena. Non capiamo se serve band completa o duo più DJ.",
    usefulVotes: 18,
    answers: [
      "Una band da matrimonio può stare tra 1.500 e 3.500 euro, in base a numero musicisti, ore e impianto. Duo acustico più DJ spesso costa meno ed è più flessibile.",
      "Chiedi se includono trasferte, service audio, scaletta cerimonia e DJ set finale. Sono le voci che cambiano molto il prezzo."
    ]
  },
  {
    title: "Fotografo per conferenza: mi serve davvero la giornata intera?",
    categorySlug: "quanto-costa",
    postType: "Quanto costa",
    eventType: "Evento aziendale",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 120,
    budgetRange: "600-1.500 euro",
    content:
      "Ci serve un fotografo per conferenza e aperitivo networking. Vorrei capire se chiedere mezza giornata o giornata intera.",
    usefulVotes: 14,
    answers: [
      "Per evento aziendale spesso trovi mezza giornata tra 500 e 900 euro, giornata tra 900 e 1.500 euro. Chiedi quante foto consegnano e in quanti giorni.",
      "Se ti servono foto per stampa o social il giorno stesso, specifica consegna rapida: puo costare extra ma evita brutte sorprese."
    ]
  },
  {
    title: "Cosa scrivere in una richiesta preventivo per un evento?",
    categorySlug: "da-dove-inizio",
    postType: "Domanda",
    eventType: "Altro",
    city: "Parma",
    region: "Emilia-Romagna",
    peopleCount: 70,
    budgetRange: "Da definire",
    content:
      "Devo contattare location e catering ma non voglio mandare messaggi troppo vaghi. Quali informazioni devo includere?",
    usefulVotes: 23,
    answers: [
      "Scrivi data o periodo, città, numero persone, tipo evento, orari, budget indicativo, servizi richiesti e cosa non ti serve. Chiedi sempre cosa è incluso e cosa è extra.",
      "Aggiungi una riga sullo stile desiderato: informale, elegante, familiare, aziendale. Aiuta molto a ricevere preventivi sensati."
    ]
  },
  {
    title: "Quanti fornitori conviene contattare prima di scegliere?",
    categorySlug: "da-dove-inizio",
    postType: "Domanda",
    eventType: "Matrimonio",
    city: "Cagliari",
    region: "Sardegna",
    peopleCount: 90,
    budgetRange: "Da definire",
    content:
      "Sto andando in confusione tra location, fiorista, DJ e catering. Non so se sto contattando troppa gente o troppo poca.",
    usefulVotes: 10,
    answers: [
      "Per ogni categoria importante contatta 3-5 fornitori. Meno rischi di non capire il mercato, di più rischi di perdere tempo e confonderti.",
      "Usa una tabella con prezzo, cosa include, pro, contro e sensazione dopo la chiamata. La decisione diventa molto più chiara."
    ]
  },
  {
    title: "Come gestire invitati che confermano tardi?",
    categorySlug: "problemi-fornitori",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Monza",
    region: "Lombardia",
    peopleCount: 100,
    budgetRange: "Menu 85 euro a persona",
    content:
      "Il catering chiede il numero finale dieci giorni prima, ma tanti invitati non rispondono. Come evitare di pagare coperti inutili?",
    usefulVotes: 16,
    answers: [
      "Metti una data RSVP molto prima di quella del catering e fai un giro telefonico una settimana prima della scadenza. Non aspettare che rispondano da soli.",
      "Chiedi al catering una tolleranza scritta, per esempio più o meno 5 coperti. Alcuni lo accettano se lo concordi prima."
    ]
  },
  {
    title: "Come organizzare una festa di laurea con budget basso?",
    categorySlug: "compleanni-feste-private",
    postType: "Domanda",
    eventType: "Laurea",
    city: "Pisa",
    region: "Toscana",
    peopleCount: 40,
    budgetRange: "700 euro",
    content:
      "Vorrei festeggiare dopo la proclamazione ma ho un budget limitato. Meglio aperitivo, casa o sala piccola?",
    usefulVotes: 15,
    answers: [
      "Con 700 euro punterei su aperitivo rinforzato in un locale con pacchetto chiuso. Casa conviene solo se hai spazio e qualcuno che ti aiuta davvero.",
      "Taglia su allestimenti e bomboniere, non su cibo e bevande. Gli invitati ricordano se sono stati comodi e hanno mangiato abbastanza."
    ]
  },
  {
    title: "Meglio buffet o cena servita per 60 persone?",
    categorySlug: "catering-menu",
    postType: "Domanda",
    eventType: "Festa privata",
    city: "Como",
    region: "Lombardia",
    peopleCount: 60,
    budgetRange: "2.500 euro",
    content:
      "Vorremmo una festa curata ma informale. Il buffet costa meno, ma temo code e confusione.",
    usefulVotes: 13,
    answers: [
      "Per 60 persone il buffet funziona se hai più punti di appoggio e personale che rifornisce. Un solo tavolo crea coda subito.",
      "Cena servita è più ordinata ma meno dinamica. Una via di mezzo è antipasto a buffet e primo o secondo servito."
    ]
  },
  {
    title: "Open bar dopo cena: meglio prezzo chiuso o tetto massimo?",
    categorySlug: "quanto-costa",
    postType: "Quanto costa",
    eventType: "Festa privata",
    city: "Rimini",
    region: "Emilia-Romagna",
    peopleCount: 90,
    budgetRange: "Da capire",
    content:
      "Vorremmo fare open bar per due ore dopo cena. Alcuni preventivi sono a consumo, altri a pacchetto. Quale conviene?",
    usefulVotes: 17,
    answers: [
      "A pacchetto puoi vedere 18-35 euro a persona per due ore, dipende da cocktail inclusi e qualità alcolici. A consumo conviene solo se il gruppo beve poco.",
      "Chiedi numero bartender, lista drink, ghiaccio, bicchieri, trasporto e cosa succede oltre l'orario. Sono dettagli che cambiano l'esperienza."
    ]
  },
  {
    title: "Come scegliere musica per una festa privata?",
    categorySlug: "musica-dj",
    postType: "Domanda",
    eventType: "Festa privata",
    city: "Palermo",
    region: "Sicilia",
    peopleCount: 50,
    budgetRange: "500 euro",
    content:
      "Gli invitati hanno età diverse e non voglio una playlist che piaccia solo a pochi. Come preparo indicazioni utili per il DJ?",
    usefulVotes: 9,
    answers: [
      "Dai al DJ tre liste: canzoni sì, canzoni no e momenti importanti. Lasciagli libertà sul resto, perché deve leggere la pista.",
      "Dividi la serata: aperitivo più soft, cena leggera, poi blocchi ballabili. Evita playlist rigide da quattro ore."
    ]
  },
  {
    title: "Cosa fare se un fornitore non risponde più?",
    categorySlug: "problemi-fornitori",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Ancona",
    region: "Marche",
    peopleCount: 80,
    budgetRange: "Caparra versata",
    content:
      "Ho versato una caparra a un fornitore e da due settimane non risponde. Non voglio fare accuse, ma sono preoccupata.",
    usefulVotes: 26,
    answers: [
      "Manda una comunicazione scritta chiara con riepilogo accordi, data evento e richiesta di risposta entro una scadenza. Usa email o PEC se disponibile.",
      "Nel frattempo cerca alternative, ma non pubblicare accuse online senza documenti. Se la cifra è importante, chiedi un parere professionale."
    ]
  },
  {
    title: "Idee per un team building aziendale leggero?",
    categorySlug: "eventi-aziendali",
    postType: "Idea",
    eventType: "Team building",
    city: "Trento",
    region: "Trentino-Alto Adige",
    peopleCount: 30,
    budgetRange: "2.000 euro",
    content:
      "Vorremmo fare qualcosa che non sembri forzato. Team piccolo, persone non tutte sportive, mezza giornata disponibile.",
    usefulVotes: 12,
    answers: [
      "Cucina a squadre, degustazione guidata o laboratorio creativo funzionano bene perché fanno collaborare senza mettere in difficoltà nessuno.",
      "Evita attività competitive troppo spinte. Meglio un obiettivo comune e un momento finale con aperitivo."
    ]
  },
  {
    title: "Come organizzare un evento da zero senza esperienza?",
    categorySlug: "da-dove-inizio",
    postType: "Domanda",
    eventType: "Altro",
    city: "Brescia",
    region: "Lombardia",
    peopleCount: 100,
    budgetRange: "Da definire",
    content:
      "Mi hanno chiesto di organizzare un evento per amici e parenti, ma non l'ho mai fatto. Da cosa parto concretamente?",
    usefulVotes: 28,
    answers: [
      "Parti da cinque cose: obiettivo, data, numero persone, budget massimo e città. Poi scegli location, cibo, musica e inviti in quest'ordine.",
      "Non cercare tutto insieme. Blocca prima luogo e data, poi chiedi preventivi agli altri fornitori con informazioni precise."
    ]
  },
  {
    title: "Preventivo location con esclusiva: conviene davvero?",
    categorySlug: "location",
    postType: "Preventivo",
    eventType: "Evento aziendale",
    city: "Varese",
    region: "Lombardia",
    peopleCount: 75,
    budgetRange: "3.800 euro",
    content:
      "Una location propone esclusiva della sala e terrazza, ma costa più di altre opzioni. L'evento è aziendale con clienti importanti.",
    usefulVotes: 8,
    answers: [
      "Per clienti importanti l'esclusiva può valere il costo se garantisce privacy, branding, audio migliore e personale dedicato. Chiedi cosa significa esclusiva nel contratto."
    ]
  },
  {
    title: "Cena in agriturismo per anniversario: cosa controllare?",
    categorySlug: "compleanni-feste-private",
    postType: "Esperienza reale",
    eventType: "Anniversario",
    city: "Siena",
    region: "Toscana",
    peopleCount: 25,
    budgetRange: "1.200 euro",
    content:
      "Sto pensando a un agriturismo per un anniversario familiare. Sembra perfetto, ma ho paura che sia scomodo per alcuni invitati.",
    usefulVotes: 7,
    answers: [
      "Controlla strada, parcheggio, accessibilità per anziani, orario di rientro e taxi disponibili. Gli agriturismi sono belli ma la logistica pesa."
    ]
  }
];

const extraQuestions = [
  {
    title: "Preventivo matrimonio: 96 euro a persona, cosa devo controllare?",
    categorySlug: "quanto-costa",
    postType: "Preventivo",
    eventType: "Matrimonio",
    city: "Bergamo",
    region: "Lombardia",
    peopleCount: 118,
    budgetRange: "96 euro a persona",
    content:
      "Il catering include aperitivo, due primi, secondo, torta e bevande base. Mi sembra completo, ma temo extra nascosti su personale, trasporto e ore finali.",
    usefulVotes: 31,
    answers: [
      "Chiedi subito se il prezzo include IVA, camerieri fino a fine evento, allestimento buffet, tovagliato, trasporto, taglio torta e acqua/vino illimitati. A volte il prezzo a persona sembra chiaro ma gli extra valgono migliaia di euro.",
      "Fatti indicare il numero minimo garantito e la data entro cui puoi modificare i coperti. Con 118 invitati anche 8 persone in meno cambiano tanto."
    ]
  },
  {
    title: "Location bellissima ma senza parcheggio: rischio troppo?",
    categorySlug: "location",
    postType: "Domanda",
    eventType: "Compleanno",
    city: "Roma",
    region: "Lazio",
    peopleCount: 70,
    budgetRange: "2.700 euro solo sala",
    content:
      "Ho trovato una sala molto bella in centro, ma il parcheggio è complicato. Gli invitati arrivano da zone diverse e temo ritardi e nervosismo già all'inizio.",
    usefulVotes: 18,
    answers: [
      "Se la sala è davvero giusta, prevedi nel messaggio invito due parcheggi consigliati, orari realistici e magari un punto taxi. Non lasciare che ognuno scopra il problema arrivando.",
      "Chiedi alla location se ha convenzioni con garage vicini. Se non sa rispondere, prova tu a chiamare due garage e bloccare qualche posto."
    ]
  },
  {
    title: "Aperitivo aziendale: meglio standing o tavoli assegnati?",
    categorySlug: "eventi-aziendali",
    postType: "Domanda",
    eventType: "Evento aziendale",
    city: "Milano",
    region: "Lombardia",
    peopleCount: 95,
    budgetRange: "6.000 euro",
    content:
      "Evento con clienti e team interno. Vorrei networking, ma ho paura che in piedi diventi disordinato e che alcuni restino isolati.",
    usefulVotes: 22,
    answers: [
      "Farei standing con qualche isola alta e alcune sedute laterali. I tavoli assegnati bloccano il networking, ma senza punti d'appoggio dopo 40 minuti le persone si stancano.",
      "Prevedi un momento breve di benvenuto e poi cibo servito in passaggio. Se tutti devono fare fila al buffet, il networking si ferma."
    ]
  },
  {
    title: "Diciottesimo con genitori presenti: come gestire musica e alcol?",
    categorySlug: "compleanni-feste-private",
    postType: "Problema",
    eventType: "Diciottesimo",
    city: "Caserta",
    region: "Campania",
    peopleCount: 85,
    budgetRange: "3.500 euro",
    content:
      "Mia figlia vuole una festa ballata, noi genitori saremo presenti e non voglio che la serata sfugga di mano. Come imposto regole senza rovinare l'atmosfera?",
    usefulVotes: 27,
    answers: [
      "Parla prima con location e DJ: orari, volume, chi decide la chiusura e come gestire richieste fuori programma. Per le bevande meglio pacchetto chiaro, niente servizio libero senza controllo.",
      "Nomina due adulti di riferimento oltre a te. Non devono stare addosso ai ragazzi, ma devono sapere cosa fare se qualcuno esagera o se serve chiamare un genitore."
    ]
  },
  {
    title: "Fiorista per matrimonio piccolo: quali voci fanno salire il prezzo?",
    categorySlug: "matrimoni",
    postType: "Quanto costa",
    eventType: "Matrimonio",
    city: "Lucca",
    region: "Toscana",
    peopleCount: 55,
    budgetRange: "1.200-2.000 euro",
    content:
      "Vorremmo pochi fiori ma belli: bouquet, bottoniera, tavoli e un piccolo arco. I preventivi sono molto diversi e non capisco il motivo.",
    usefulVotes: 19,
    answers: [
      "Sale il prezzo quando chiedi strutture, montaggio in due luoghi, fiori fuori stagione e molto verde scenografico. Chiedi un preventivo diviso tra materiali, fiori, trasporto e manodopera.",
      "Se il budget è stretto, investi su bouquet e tavoli. L'arco è bello in foto ma spesso costa molto per pochi minuti di utilizzo."
    ]
  },
  {
    title: "Team building con colleghi timidi: idee non imbarazzanti?",
    categorySlug: "idee-evento",
    postType: "Idea",
    eventType: "Team building",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 28,
    budgetRange: "1.800 euro",
    content:
      "Il gruppo è misto: alcuni sono estroversi, altri odiano mettersi in mostra. Cerco attività che facciano parlare senza forzare nessuno.",
    usefulVotes: 25,
    answers: [
      "Degustazione guidata, cooking class a squadre o laboratorio di ceramica funzionano bene perché l'attenzione è sull'attività, non sulla performance personale.",
      "Evita quiz con domande personali o giochi da palco. Meglio piccoli gruppi da 4-5 persone e un momento finale condiviso."
    ]
  },
  {
    title: "Menu bambini al matrimonio: lo devo prevedere per tutti?",
    categorySlug: "catering-menu",
    postType: "Domanda",
    eventType: "Matrimonio",
    city: "Modena",
    region: "Emilia-Romagna",
    peopleCount: 104,
    budgetRange: "Menu adulti 88 euro",
    content:
      "Avremo circa 12 bambini tra 3 e 10 anni. Il catering propone menu ridotto ma non so se valga per tutti o solo per i più piccoli.",
    usefulVotes: 17,
    answers: [
      "Chiedi due fasce: piccoli 3-7 anni e ragazzi 8-12. Spesso i più grandi mangiano quasi come adulti, ma non ha senso pagarli prezzo pieno se il menu è lungo.",
      "Prevedi servizio più veloce per loro e un angolo tranquillo. I bambini aspettano meno volentieri degli adulti."
    ]
  },
  {
    title: "Evento all'aperto in luglio: come evitare ospiti stanchi dal caldo?",
    categorySlug: "location",
    postType: "Problema",
    eventType: "Festa privata",
    city: "Bari",
    region: "Puglia",
    peopleCount: 60,
    budgetRange: "2.200 euro",
    content:
      "La location è un giardino molto bello, ma a luglio può fare caldo. L'evento inizia alle 18 e vorrei evitare che tutti cerchino solo ombra e acqua.",
    usefulVotes: 21,
    answers: [
      "Sposta i momenti più fermi dopo il tramonto e prevedi acqua già all'arrivo, ventagli o nebulizzatori leggeri. Non mettere il buffet in pieno sole.",
      "Chiedi alla location foto o video di eventi estivi nello stesso orario. Capisci subito dove batte il sole e se l'ombra basta davvero."
    ]
  },
  {
    title: "Fotografo chiede saldo prima dell'evento: è normale?",
    categorySlug: "problemi-fornitori",
    postType: "Problema",
    eventType: "Evento aziendale",
    city: "Padova",
    region: "Veneto",
    peopleCount: 140,
    budgetRange: "1.100 euro",
    content:
      "Il fotografo ci chiede saldo completo una settimana prima. L'azienda preferirebbe pagare dopo consegna foto. Come si può mediare?",
    usefulVotes: 16,
    answers: [
      "Proponi acconto alla firma, seconda tranche il giorno evento e saldo alla consegna della gallery. È una divisione abbastanza equilibrata.",
      "Inserisci nel contratto tempi di consegna, numero minimo foto e uso commerciale. Per eventi aziendali è importante quanto il prezzo."
    ]
  },
  {
    title: "Cena privata in casa: quante persone sono troppe?",
    categorySlug: "catering-menu",
    postType: "Domanda",
    eventType: "Cena privata",
    city: "Bologna",
    region: "Emilia-Romagna",
    peopleCount: 32,
    budgetRange: "1.400 euro",
    content:
      "Vorrei fare una cena per il compleanno in casa, ma ho paura che 32 persone siano troppe tra cucina, piatti e spazio per muoversi.",
    usefulVotes: 14,
    answers: [
      "Per 32 persone in casa eviterei cena servita se non hai spazi ampi. Meglio buffet curato con due persone di servizio e stoviglie noleggiate.",
      "Conta bagni, guardaroba, frigorifero e vicini. Spesso il limite non è il salotto, ma tutto quello che succede intorno."
    ]
  },
  {
    title: "Evento clienti: come chiedere preventivi senza sembrare vaghi?",
    categorySlug: "da-dove-inizio",
    postType: "Domanda",
    eventType: "Evento aziendale",
    city: "Firenze",
    region: "Toscana",
    peopleCount: 50,
    budgetRange: "4.000 euro",
    content:
      "Devo scrivere a tre location per un evento clienti. Voglio ricevere risposte confrontabili e non tre proposte completamente diverse.",
    usefulVotes: 24,
    answers: [
      "Manda una scheda unica: data, orario, numero persone, obiettivo evento, stile, budget, necessità tecniche, catering e parcheggio. Chiedi preventivo con voci separate.",
      "Aggiungi una deadline e una domanda secca: cosa è incluso e cosa resta escluso? Ti semplifica molto il confronto."
    ]
  },
  {
    title: "Open bar a consumo: come evitare sorprese sul conto?",
    categorySlug: "quanto-costa",
    postType: "Preventivo",
    eventType: "Festa privata",
    city: "Riccione",
    region: "Emilia-Romagna",
    peopleCount: 75,
    budgetRange: "A consumo",
    content:
      "Il locale propone drink a consumo invece di pacchetto. Ho paura che a fine serata il conto salga troppo, ma il pacchetto fisso sembra caro.",
    usefulVotes: 20,
    answers: [
      "Chiedi un tetto massimo scritto: arrivati a quella cifra, il bar passa a pagamento individuale o si ferma. Senza tetto sei esposto.",
      "Puoi anche limitare la lista drink: vino, birra e due cocktail. Più scelta significa più variabilità."
    ]
  },
  {
    title: "Anniversario dei genitori: idea elegante ma non troppo formale?",
    categorySlug: "idee-evento",
    postType: "Idea",
    eventType: "Anniversario",
    city: "Verona",
    region: "Veneto",
    peopleCount: 38,
    budgetRange: "2.000 euro",
    content:
      "Vorremmo festeggiare 40 anni di matrimonio dei miei genitori. Niente festa rumorosa, ma qualcosa di caldo e curato.",
    usefulVotes: 23,
    answers: [
      "Pranzo in sala privata con piccolo momento foto/video di famiglia funziona benissimo. Puoi aggiungere un menu stampato con una frase personale.",
      "Se vuoi renderlo speciale senza alzare troppo i costi, investi in tavola, luci calde e una torta bella. Il resto può restare semplice."
    ]
  },
  {
    title: "DJ o playlist per festa di laurea?",
    categorySlug: "musica-dj",
    postType: "Domanda",
    eventType: "Laurea",
    city: "Pavia",
    region: "Lombardia",
    peopleCount: 45,
    budgetRange: "800 euro totale festa",
    content:
      "Budget limitato: il DJ mi prende quasi metà spesa. Però ho paura che con playlist la serata si spenga presto.",
    usefulVotes: 15,
    answers: [
      "Se il locale ha impianto buono e la festa è breve, playlist curata può bastare. Serve però una persona incaricata, non un telefono lasciato a caso.",
      "Valuta DJ solo per due ore finali. A volte costa meno e dà energia nel momento giusto."
    ]
  },
  {
    title: "Convention aziendale: quanto tempo lasciare per il networking?",
    categorySlug: "eventi-aziendali",
    postType: "Esperienza reale",
    eventType: "Evento aziendale",
    city: "Roma",
    region: "Lazio",
    peopleCount: 180,
    budgetRange: "18.000 euro",
    content:
      "Stiamo costruendo agenda con talk, coffee break e aperitivo finale. Ho paura che diventi tutto troppo fitto.",
    usefulVotes: 29,
    answers: [
      "Lascia almeno 25-30 minuti per coffee break reali e 60 minuti per aperitivo finale. Se metti pause da 10 minuti, servono solo per il bagno.",
      "Metti i talk più importanti prima del break lungo. Dopo il networking le persone rientrano più lentamente."
    ]
  },
  {
    title: "Bomboniere o donazione: come comunicarlo agli invitati?",
    categorySlug: "matrimoni",
    postType: "Idea",
    eventType: "Matrimonio",
    city: "Palermo",
    region: "Sicilia",
    peopleCount: 90,
    budgetRange: "600 euro",
    content:
      "Non vorremmo fare bomboniere classiche. Pensavamo a una donazione, ma non sappiamo come comunicarla senza sembrare freddi.",
    usefulVotes: 13,
    answers: [
      "Prepara un cartoncino piccolo e concreto: spiegate il progetto scelto e perché vi rappresenta. Non serve giustificarsi troppo.",
      "Puoi aggiungere un dettaglio semplice al tavolo, tipo confetti belli o un segnaposto curato. Così l'ospite non percepisce un vuoto."
    ]
  },
  {
    title: "Festa in terrazza: vicini e limiti orari, cosa scrivere agli invitati?",
    categorySlug: "problemi-fornitori",
    postType: "Burocrazia",
    eventType: "Festa privata",
    city: "Napoli",
    region: "Campania",
    peopleCount: 40,
    budgetRange: "1.000 euro",
    content:
      "Faremo una festa in terrazza condominiale. Voglio evitare problemi con rumore, musica e persone che arrivano troppo tardi.",
    usefulVotes: 18,
    answers: [
      "Scrivi già nell'invito orario di inizio e fine musica. Avvisa i vicini con un messaggio educato e lascia un tuo numero per emergenze.",
      "Tieni la musica più alta nella prima parte e abbassala dopo un orario concordato. Il problema spesso nasce quando gli ospiti continuano a entrare e uscire."
    ]
  },
  {
    title: "Preventivo animazione bambini: quali domande fare?",
    categorySlug: "compleanni-feste-private",
    postType: "Preventivo",
    eventType: "Compleanno",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 22,
    budgetRange: "250-450 euro",
    content:
      "Compleanno di 6 anni con bambini di età diverse. Alcuni preventivi includono bolle, truccabimbi e giochi, altri solo presenza animatore.",
    usefulVotes: 12,
    answers: [
      "Chiedi durata effettiva, numero animatori, materiali inclusi, gestione bambini piccoli e cosa succede se piove. Un animatore solo con 22 bambini può essere poco.",
      "Fatti mandare una scaletta semplice. Se non sanno spiegare cosa faranno nei 90 minuti, rischi molta improvvisazione."
    ]
  }
];

const allQuestions = [
  {
    title: "DJ per diciottesimo a Roma: 750 euro con luci base",
    categorySlug: "quanto-costa",
    postType: "Quanto costa",
    eventType: "Diciottesimo",
    city: "Roma",
    region: "Lazio",
    peopleCount: 80,
    budgetRange: "600-800 euro",
    content:
      "Sto aiutando mia sorella a organizzare il diciottesimo. Il DJ ci ha chiesto 750 euro per 5 ore, impianto e luci base inclusi. A me sembra tanto, pero non ho paragoni. Cosa dovrei chiedergli prima di dire si?",
    usefulVotes: 24,
    answers: [
      "A Roma non e una cifra assurda se impianto, luci e montaggio sono compresi. Io chiederei orario preciso, costo oltre la mezzanotte, chi porta microfono e se ha un sostituto in caso di imprevisto.",
      "Guarda anche come lavora, non solo il prezzo. Fatti mandare video di feste simili e chiedi se vuole una lista di brani no. Per un diciottesimo e importante quanto la tecnica."
    ]
  },
  {
    title: "Buffet per 50 persone: il catering mi ha mandato 2.900 euro",
    categorySlug: "catering-menu",
    postType: "Quanto costa",
    eventType: "Cena privata",
    city: "Bologna",
    region: "Emilia-Romagna",
    peopleCount: 50,
    budgetRange: "2.500-3.000 euro",
    content:
      "Festa privata in una sala, niente matrimonio. Buffet salato, torta, acqua e vino. Il preventivo e 2.900 euro con due persone di servizio. Non capisco se e caro o se ormai i prezzi sono questi.",
    usefulVotes: 28,
    answers: [
      "Sono circa 58 euro a persona: non poco, ma con servizio e bevande non e fuori mercato. Chiedi se include trasporto, allestimento, tovagliato, piatti, smontaggio e IVA.",
      "Io mi farei fare una versione senza torta e una con bevande limitate. A volte tagli 400-500 euro senza cambiare troppo la serata."
    ]
  },
  {
    title: "Villa bellissima per i 40 anni, ma ho paura degli extra",
    categorySlug: "location",
    postType: "Domanda",
    eventType: "Compleanno",
    city: "Firenze",
    region: "Toscana",
    peopleCount: 60,
    budgetRange: "4.000 euro",
    content:
      "Ho visto una villa stupenda per il mio compleanno, pero mi sto rendendo conto che poi devo aggiungere catering, musica, pulizie e forse sicurezza. Il ristorante e meno bello ma molto piu semplice. Qualcuno ci e passato?",
    usefulVotes: 19,
    answers: [
      "La villa vince se vuoi personalizzare tanto. Pero fatti mettere per iscritto pulizie, orari, bagni, parcheggio, cucina disponibile, limiti musica e referente presente quella sera.",
      "Per un compleanno sceglierei villa solo se hai una persona che coordina. Se devi fare tutto tu, il ristorante ti salva la serata e forse anche l'umore."
    ]
  },
  {
    title: "Preventivo location: 2.600 euro solo affitto sala, cosa controllo?",
    categorySlug: "location",
    postType: "Preventivo",
    eventType: "Festa privata",
    city: "Milano",
    region: "Lombardia",
    peopleCount: 95,
    budgetRange: "2.600 euro solo spazio",
    content:
      "La sala mi piace, ma il prezzo e solo per lo spazio. Non include catering e non ho capito bene audio, guardaroba e pulizie. Prima di farmi prendere dall'entusiasmo, quali domande fareste?",
    usefulVotes: 21,
    answers: [
      "Chiedi una tabella: ore incluse, costo ora extra, pulizie, tecnico audio, arredi, guardaroba, riscaldamento, personale obbligatorio, deposito cauzionale e IVA.",
      "Se devi portare tutto da fuori, confrontala con una location da 3.500 che include gia tavoli, sedie e tecnico. Il prezzo basso sulla carta a volte non e basso."
    ]
  },
  {
    title: "Matrimonio nel 2027: siamo gia in ritardo con la location?",
    categorySlug: "matrimoni",
    postType: "Domanda",
    eventType: "Matrimonio",
    city: "Napoli",
    region: "Campania",
    peopleCount: 120,
    budgetRange: "da definire",
    content:
      "Ci sposiamo a giugno 2027 e pensavo fosse presto, invece due ville ci hanno gia detto che alcuni sabati sono occupati. Mi sta salendo l'ansia: quando avete bloccato voi?",
    usefulVotes: 26,
    answers: [
      "Per giugno e settembre io inizierei subito. Non vuol dire firmare domani, ma visitare e chiedere disponibilita si. I sabati belli finiscono presto.",
      "Prima di bloccare guarda il piano pioggia. Molte coppie si innamorano del giardino e poi scoprono che il piano B e una sala stretta."
    ]
  },
  {
    title: "Catering matrimonio: due preventivi simili, ma non so leggerli",
    categorySlug: "catering-menu",
    postType: "Preventivo",
    eventType: "Matrimonio",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 90,
    budgetRange: "75-95 euro a persona",
    content:
      "Abbiamo due proposte quasi uguali come prezzo. Una sembra piu elegante, l'altra piu chiara. Prima di versare la caparra vorrei capire quali righe del preventivo guardare davvero.",
    usefulVotes: 23,
    answers: [
      "Guarda numero camerieri, durata servizio, bevande, torta, mise en place, trasporto, prova menu, menu bambini e intolleranze. Il prezzo a persona da solo dice pochissimo.",
      "Io sceglierei quello piu chiaro. Se gia ora devi inseguire le spiegazioni, immagina a due settimane dal matrimonio."
    ]
  },
  {
    title: "Cena aziendale di fine anno: il ristorante include davvero tutto?",
    categorySlug: "eventi-aziendali",
    postType: "Quanto costa",
    eventType: "Evento aziendale",
    city: "Padova",
    region: "Veneto",
    peopleCount: 45,
    budgetRange: "2.700 euro",
    content:
      "Devo proporre un budget al titolare. Cena seduta, vino incluso, piccola sala privata. Il ristorante parla di 60 euro a persona. Vorrei evitare di arrivare corta con gli extra.",
    usefulVotes: 18,
    answers: [
      "60 euro con vino incluso e sala privata ci sta. Chiedi se sono inclusi acqua, caffe, microfono, menu per intolleranze, IVA e se c'e un minimo garantito.",
      "Tieni un margine del 10-15%. Nelle cene aziendali saltano fuori sempre: prosecco iniziale, due persone in piu, parcheggi, stampa menu o piccolo audio."
    ]
  },
  {
    title: "SIAE per festa privata: devo pensarci io o il DJ?",
    categorySlug: "musica-dj",
    postType: "Burocrazia",
    eventType: "Festa privata",
    city: "Bari",
    region: "Puglia",
    peopleCount: 70,
    budgetRange: "non so",
    content:
      "La sala mi ha detto 'per la SIAE vedete voi'. Il DJ dice che mi aiuta, ma non ho capito chi deve fare cosa. Non vorrei arrivare alla settimana prima nel panico.",
    usefulVotes: 17,
    answers: [
      "Di solito l'organizzatore si assicura che il permesso ci sia, poi il DJ puo aiutare con il programma musicale. Chiedi alla sala se hanno una procedura gia usata.",
      "Non lasciarla all'ultimo. Chiedi a DJ e location cosa serve: data, indirizzo, numero invitati, musica registrata o live. Poi tieni ricevuta e contatti a portata."
    ]
  },
  {
    title: "Location all'aperto: il piano B non mi convince per niente",
    categorySlug: "location",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Perugia",
    region: "Umbria",
    peopleCount: 110,
    budgetRange: "da definire",
    content:
      "Il giardino e meraviglioso, ma se piove ci spostano in una sala che mi sembra un ripiego. La location dice 'non si preoccupi', ma io invece mi preoccupo eccome.",
    usefulVotes: 31,
    answers: [
      "Chiedi di vedere il piano B allestito, non vuoto. Devono starci tavoli, buffet, musica, passaggi dei camerieri e zona torta. Se non te lo fanno vedere, e un segnale.",
      "Il piano B deve piacerti almeno al 70%. Se ti rovina completamente l'idea dell'evento, continua a cercare."
    ]
  },
  {
    title: "DJ economico trovato su Instagram: come capisco se e affidabile?",
    categorySlug: "musica-dj",
    postType: "Problema",
    eventType: "Compleanno",
    city: "Genova",
    region: "Liguria",
    peopleCount: 55,
    budgetRange: "400 euro",
    content:
      "Mi piace come comunica, ma costa molto meno degli altri. Vorrei risparmiare, pero ho paura di ritrovarmi con audio scarso o playlist improvvisata.",
    usefulVotes: 22,
    answers: [
      "Chiedi contratto anche semplice, attrezzatura inclusa, orari, video di serate vere e cosa succede se si ammala. Se si offende per queste domande, lascia stare.",
      "Fai una call di 15 minuti. Capisci subito se ascolta il tipo di pubblico o se vuole solo venderti la sua serata standard."
    ]
  },
  {
    title: "Caparra location al 40%: mi sembra tantissima",
    categorySlug: "problemi-fornitori",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Verona",
    region: "Veneto",
    peopleCount: 100,
    budgetRange: "caparra 40%",
    content:
      "La villa chiede il 40% alla firma. La data e tra un anno e mezzo. Mi piace molto, ma mi sembra di espormi troppo. Cosa posso negoziare senza sembrare pesante?",
    usefulVotes: 20,
    answers: [
      "Chiedi se e caparra confirmatoria o acconto, cosa succede con cambio data, annullamento e cause di forza maggiore. Sono parole noiose, ma contano tantissimo.",
      "Puoi proporre 20% alla firma, 20% a sei mesi e saldo vicino all'evento. Se hanno una politica rigida almeno devono spiegartela bene."
    ]
  },
  {
    title: "Compleanno adulto: non voglio la solita cena infinita",
    categorySlug: "idee-evento",
    postType: "Idea",
    eventType: "Compleanno",
    city: "Roma",
    region: "Lazio",
    peopleCount: 35,
    budgetRange: "1.500 euro",
    content:
      "Compio 42 anni e vorrei qualcosa di carino, ma senza tavolata da tre ore dove alla fine parlano solo i vicini di posto. Avete idee fattibili?",
    usefulVotes: 16,
    answers: [
      "Degustazione con tavoli che cambiano, aperitivo con mini laboratorio cocktail o cena in piedi con isole diverse. La gente si muove e parla di piu.",
      "Io farei un momento centrale di 30 minuti, tipo quiz leggero su di te o brindisi con foto vecchie. Poi musica bassa e cibo facile da prendere."
    ]
  },
  {
    title: "Cena aziendale: come evitare l'effetto obbligo scolastico?",
    categorySlug: "eventi-aziendali",
    postType: "Idea",
    eventType: "Evento aziendale",
    city: "Milano",
    region: "Lombardia",
    peopleCount: 65,
    budgetRange: "5.000 euro",
    content:
      "L'anno scorso e stata pesantissima: discorsi lunghi, tavoli rigidi, tutti al telefono. Quest'anno vorrei qualcosa di piu leggero senza diventare cringe.",
    usefulVotes: 18,
    answers: [
      "Taglia i discorsi a 8-10 minuti totali e mettili all'inizio. Poi tavoli misti, menu veloce e un piccolo momento di premiazione non imbarazzante.",
      "Funzionano bene degustazione, quiz a squadre con domande sull'azienda o cena walking. Evita giochi fisici e obbligo di parlare al microfono."
    ]
  },
  {
    title: "Band matrimonio: meglio gruppo live o duo piu DJ?",
    categorySlug: "musica-dj",
    postType: "Quanto costa",
    eventType: "Matrimonio",
    city: "Lecce",
    region: "Puglia",
    peopleCount: 130,
    budgetRange: "1.500-3.000 euro",
    content:
      "Ci piacerebbe musica live all'aperitivo e festa dopo cena. La band completa costa tanto, il duo piu DJ sembra piu gestibile. Qualcuno ha scelto una via di mezzo?",
    usefulVotes: 20,
    answers: [
      "Duo live per aperitivo e DJ dopo cena e una soluzione furba. Hai atmosfera all'inizio e energia dopo, senza pagare 5 musicisti per tutta la giornata.",
      "Chiedi bene service audio, trasferte, ore effettive e chi gestisce eventuale cerimonia. Sono le voci che fanno saltare il budget."
    ]
  },
  {
    title: "Fotografo per conferenza: mezza giornata basta?",
    categorySlug: "quanto-costa",
    postType: "Quanto costa",
    eventType: "Evento aziendale",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 120,
    budgetRange: "600-1.200 euro",
    content:
      "Evento aziendale con talk al mattino e aperitivo networking. Ci servono foto per sito e social, non un reportage enorme. Meglio mezza giornata o giornata intera?",
    usefulVotes: 15,
    answers: [
      "Se i momenti importanti sono concentrati, mezza giornata puo bastare. Fai una lista: sala piena, speaker, dettagli brand, pubblico, networking, foto gruppo.",
      "Chiedi consegna di 15-20 foto entro 24 ore per social e gallery completa dopo. La consegna rapida spesso costa, ma vale se dovete comunicare subito."
    ]
  },
  {
    title: "Cosa scrivo nella mail ai fornitori per non ricevere risposte vaghe?",
    categorySlug: "da-dove-inizio",
    postType: "Domanda",
    eventType: "Altro",
    city: "Parma",
    region: "Emilia-Romagna",
    peopleCount: 70,
    budgetRange: "da definire",
    content:
      "Devo scrivere a location e catering. Quando mando messaggi generici mi rispondono con brochure infinite. Vorrei ricevere preventivi confrontabili, non romanzi.",
    usefulVotes: 29,
    answers: [
      "Metti in punti: data o periodo, citta, numero persone, orario, tipo evento, budget indicativo, cosa ti serve e cosa non ti serve. Chiudi chiedendo voci incluse ed extra.",
      "Scrivi anche lo stile: informale, elegante, aziendale, famiglia. Sembra un dettaglio, ma cambia molto le proposte che ricevi."
    ]
  },
  {
    title: "Sto contattando troppi fornitori e non capisco piu nulla",
    categorySlug: "da-dove-inizio",
    postType: "Sfogo",
    eventType: "Matrimonio",
    city: "Cagliari",
    region: "Sardegna",
    peopleCount: 90,
    budgetRange: "da definire",
    content:
      "Ho aperto venti chat tra location, fiori, DJ e catering. Tutti sembrano urgenti e io non sto decidendo niente. Come vi siete organizzati senza impazzire?",
    usefulVotes: 17,
    answers: [
      "Scegli massimo 3-4 fornitori per categoria. Oltre quel numero inizi a confrontare dettagli inutili e perdi lucidita.",
      "Fai una tabella brutta ma utile: prezzo, cosa include, cosa manca, sensazione dopo la call, scadenza risposta. Decide piu quella di mille screenshot."
    ]
  },
  {
    title: "Invitati che non confermano: il catering vuole il numero finale",
    categorySlug: "problemi-fornitori",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Monza",
    region: "Lombardia",
    peopleCount: 100,
    budgetRange: "85 euro a persona",
    content:
      "Mancano tre settimane e ci sono ancora persone che rispondono 'ti faccio sapere'. Il catering vuole il numero definitivo 10 giorni prima. Come metto un limite senza sembrare maleducata?",
    usefulVotes: 21,
    answers: [
      "Manda un messaggio chiaro: 'Dobbiamo confermare i coperti entro venerdi, dopo quella data purtroppo non riusciamo a garantire il posto'. Non e maleducazione, e organizzazione.",
      "Chiedi al catering una tolleranza scritta di 3-5 coperti. Alcuni la danno, ma va concordata prima."
    ]
  },
  {
    title: "Festa di laurea con 700 euro: meglio locale o casa?",
    categorySlug: "compleanni-feste-private",
    postType: "Domanda",
    eventType: "Laurea",
    city: "Pisa",
    region: "Toscana",
    peopleCount: 40,
    budgetRange: "700 euro",
    content:
      "Vorrei festeggiare dopo la proclamazione, ma il budget e basso. A casa risparmierei, pero ho paura di stressare tutti con spesa, piatti e pulizie.",
    usefulVotes: 18,
    answers: [
      "Con 700 euro cercherei un aperitivo rinforzato con prezzo chiuso. Casa conviene solo se hai spazio, frigo e qualcuno che ti aiuta davvero.",
      "Taglia decorazioni e gadget, non cibo e bevande. Una laurea semplice ma comoda funziona meglio di una festa piena di cose fatte di corsa."
    ]
  },
  {
    title: "Buffet per 60 persone: paura code e caos",
    categorySlug: "catering-menu",
    postType: "Domanda",
    eventType: "Festa privata",
    city: "Como",
    region: "Lombardia",
    peopleCount: 60,
    budgetRange: "2.500 euro",
    content:
      "Il buffet mi piace perche e informale, ma ho visto feste dove tutti fanno fila e poi mangiano in piedi scomodi. Come lo impostereste?",
    usefulVotes: 16,
    answers: [
      "Per 60 persone servono almeno due punti buffet o un passaggio di vassoi all'inizio. Un solo tavolo crea coda nei primi dieci minuti.",
      "Fai buffet per antipasto e dolci, ma un piatto servito al tavolo se vuoi ordine. E una via di mezzo che spesso funziona."
    ]
  },
  {
    title: "Open bar: pacchetto o consumo? Ho paura del conto finale",
    categorySlug: "quanto-costa",
    postType: "Preventivo",
    eventType: "Festa privata",
    city: "Rimini",
    region: "Emilia-Romagna",
    peopleCount: 90,
    budgetRange: "da capire",
    content:
      "Il locale propone 28 euro a persona per due ore oppure drink a consumo. Il gruppo beve abbastanza e non vorrei fare una figuraccia, ma nemmeno pagare un'esagerazione.",
    usefulVotes: 23,
    answers: [
      "Se il gruppo beve, il pacchetto ti fa dormire meglio. Chiedi lista drink, numero bartender, ghiaccio, bicchieri e cosa succede se si sfora l'orario.",
      "A consumo lo farei solo con tetto massimo scritto. Arrivati a quella cifra, il bar si ferma o passa a pagamento individuale."
    ]
  },
  {
    title: "Playlist o DJ per festa di laurea?",
    categorySlug: "musica-dj",
    postType: "Domanda",
    eventType: "Laurea",
    city: "Pavia",
    region: "Lombardia",
    peopleCount: 45,
    budgetRange: "800 euro totale",
    content:
      "Il DJ si mangia meta budget. Pero ho paura che con Spotify dopo un'ora ognuno chieda la sua canzone e la festa si spenga. Voi cosa fareste?",
    usefulVotes: 16,
    answers: [
      "Se il locale ha impianto buono, playlist puo bastare. Ma serve una persona sola che la gestisce, non il telefono passato di mano in mano.",
      "Puoi chiedere a un DJ solo due ore finali. Costa meno e ti copre il momento in cui vuoi far ballare."
    ]
  },
  {
    title: "Fornitore sparito dopo la caparra: come scrivo senza accusare?",
    categorySlug: "problemi-fornitori",
    postType: "Problema",
    eventType: "Matrimonio",
    city: "Ancona",
    region: "Marche",
    peopleCount: 80,
    budgetRange: "caparra versata",
    content:
      "Ha sempre risposto velocemente, poi dopo la caparra silenzio. Non voglio fare casino online, ma mi sta salendo l'ansia. Cosa scrivo per sbloccare la situazione?",
    usefulVotes: 33,
    answers: [
      "Manda una mail molto neutra: riepilogo accordi, data evento, caparra versata, punti ancora da confermare e richiesta di risposta entro una data precisa.",
      "Intanto cerca un piano B, senza minacciare. Se la cifra e alta o continua a non rispondere, senti un professionista invece di sfogarti sui social."
    ]
  },
  {
    title: "Team building leggero per colleghi timidi",
    categorySlug: "eventi-aziendali",
    postType: "Idea",
    eventType: "Team building",
    city: "Trento",
    region: "Trentino-Alto Adige",
    peopleCount: 30,
    budgetRange: "2.000 euro",
    content:
      "Il gruppo e misto: alcuni partecipano volentieri, altri odiano giochi e presentazioni. Vorrei qualcosa che faccia parlare senza mettere nessuno in imbarazzo.",
    usefulVotes: 18,
    answers: [
      "Cooking class, degustazione guidata o laboratorio manuale sono piu sicuri. L'attenzione e sull'attivita, non sulla persona.",
      "Evita gare fisiche e giochi da palco. Meglio piccoli gruppi, obiettivo semplice e aperitivo finale."
    ]
  },
  {
    title: "Organizzare un evento da zero: qual e il primo passo vero?",
    categorySlug: "da-dove-inizio",
    postType: "Domanda",
    eventType: "Altro",
    city: "Brescia",
    region: "Lombardia",
    peopleCount: 100,
    budgetRange: "da definire",
    content:
      "Mi hanno chiesto di organizzare una festa grande di famiglia. Io non l'ho mai fatto e sto saltando da location a menu a musica senza decidere nulla. Da dove parto davvero?",
    usefulVotes: 34,
    answers: [
      "Prima scrivi cinque cose: perche si fa, data o periodo, numero persone, budget massimo e zona. Senza queste, ogni preventivo sara vago.",
      "Blocca luogo e data prima di tutto. Solo dopo ha senso parlare con catering, musica, fotografo e allestimenti."
    ]
  },
  {
    title: "Festa in terrazza: come evitare problemi coi vicini?",
    categorySlug: "problemi-fornitori",
    postType: "Burocrazia",
    eventType: "Festa privata",
    city: "Napoli",
    region: "Campania",
    peopleCount: 40,
    budgetRange: "1.000 euro",
    content:
      "Vorremmo fare una festa in terrazza condominiale. Niente esagerazioni, ma musica e gente che entra/esce ci saranno. Come lo comunichereste ai vicini?",
    usefulVotes: 19,
    answers: [
      "Avvisa i vicini qualche giorno prima con orario inizio e fine musica, tono gentile e tuo numero. Gia questo abbassa molto il rischio discussioni.",
      "Metti fine musica chiara e abbassa prima che qualcuno si lamenti. Il problema spesso non e la festa, ma il via vai rumoroso dopo mezzanotte."
    ]
  },
  {
    title: "Animatore bambini: un solo animatore per 22 bambini basta?",
    categorySlug: "compleanni-feste-private",
    postType: "Preventivo",
    eventType: "Compleanno",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 22,
    budgetRange: "250-450 euro",
    content:
      "Compleanno di 6 anni, bambini dai 4 agli 8. Un preventivo prevede un solo animatore con giochi e bolle. A me sembra poco, ma magari sono esagerata.",
    usefulVotes: 14,
    answers: [
      "Con 22 bambini e eta diverse io chiederei due animatori o almeno un adulto di supporto. Uno solo rischia di passare la festa a rincorrere il gruppo.",
      "Fatti mandare scaletta: accoglienza, gioco, torta, momento libero. Se non sanno descrivere i 90 minuti, rischi improvvisazione."
    ]
  },
  {
    title: "Fiori matrimonio piccolo: perche i preventivi cambiano cosi tanto?",
    categorySlug: "matrimoni",
    postType: "Quanto costa",
    eventType: "Matrimonio",
    city: "Lucca",
    region: "Toscana",
    peopleCount: 55,
    budgetRange: "1.200-2.000 euro",
    content:
      "Vorremmo pochi fiori ma belli: bouquet, bottoniera, tavoli e un piccolo arco. Un fiorista chiede quasi il doppio dell'altro. Non capisco cosa sto confrontando.",
    usefulVotes: 20,
    answers: [
      "Chiedi dettaglio tra fiori, struttura, trasporto, montaggio, smontaggio e manodopera. L'arco spesso pesa tantissimo perche richiede struttura e tempo.",
      "Se il budget e stretto, scegli bouquet e tavoli. Meglio pochi punti ben fatti che aggiungere elementi piccoli ovunque."
    ]
  }
] as const;

function eventPhaseForQuestion(question: (typeof allQuestions)[number]) {
  const text = `${question.title} ${question.content}`.toLowerCase();

  if (question.postType === "Problema" || /caparra|fornitore|ritardo|non risponde|saldo/.test(text)) {
    return "problema-urgente";
  }

  if (question.postType === "Preventivo" || question.postType === "Quanto costa" || /preventivo|budget|costa|costi/.test(text)) {
    return "scelta-fornitori";
  }

  if (/confermano|timeline|ultimo|piove|giorno evento/.test(text)) {
    return "manca-meno-di-un-mese";
  }

  if (/inizio|partire|zero|anticipo|prima/.test(text)) {
    return "sto-iniziando";
  }

  return question.categorySlug === "idee-evento" ? "sto-iniziando" : "scelta-fornitori";
}

const authorProfiles = [
  { displayMode: "real_name", displayName: "Laura" },
  { displayMode: "nickname", displayName: "budget_sincero" },
  { displayMode: "real_name", displayName: "Martina" },
  { displayMode: "nickname", displayName: "eventi_con_ansia" },
  { displayMode: "real_name", displayName: "Chiara" },
  { displayMode: "real_name", displayName: "Francesca" },
  { displayMode: "nickname", displayName: "lista_invitati" },
  { displayMode: "real_name", displayName: "Elena" },
  { displayMode: "nickname", displayName: "preventivi_pazzi" },
  { displayMode: "real_name", displayName: "Sara" },
  { displayMode: "real_name", displayName: "Valentina" },
  { displayMode: "anonymous", displayName: null }
] as const;

const answerProfiles = [
  { displayMode: "real_name", displayName: "Alessia" },
  { displayMode: "nickname", displayName: "planner_di_bordo" },
  { displayMode: "real_name", displayName: "Marta" },
  { displayMode: "nickname", displayName: "costi_reali" },
  { displayMode: "real_name", displayName: "Giulia" },
  { displayMode: "nickname", displayName: "fornitori_check" }
] as const;

const editorialArticles = [
  {
    title: "Matrimoni 2026: meno scena, più esperienza",
    slug: "matrimoni-2026-meno-scena-piu-esperienza",
    kicker: "Trend eventi",
    excerpt:
      "Le coppie cercano eventi più personali, belli da vivere e non solo da fotografare: menu, ritmo della giornata e ospitalità diventano centrali.",
    category: "Matrimoni",
    tags: "matrimoni 2026,trend matrimonio,organizzazione matrimonio,esperienza invitati",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Coppia durante un matrimonio elegante all'aperto",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 6,
    metaTitle: "Matrimoni 2026: trend, idee e consigli pratici",
    metaDescription:
      "Guida ai trend matrimonio 2026: esperienza invitati, menu, location, privacy, budget e consigli pratici per organizzare un evento personale.",
    aiSummary:
      "Nel 2026 il matrimonio tende a diventare più intenzionale: meno decorazione fine a se stessa, più attenzione a ritmo, comfort, menu, privacy e momenti memorabili.",
    keyTakeaways:
      "L'esperienza degli invitati conta quanto l'estetica.\nMenu, musica e timeline devono lavorare insieme.\nI dettagli personali funzionano meglio quando semplificano la giornata.\nPrima di spendere in scenografia, verifica comfort, piano B e servizio.",
    content: `## Perché il matrimonio 2026 sembra diverso
Il punto non è fare meno, ma fare meglio. Molte coppie vogliono un evento riconoscibile, curato, ma più facile da vivere. La domanda giusta non è solo "che stile scegliamo?", ma "come vogliamo far stare le persone per sei o otto ore?".

## Dove investire davvero
Il budget funziona meglio quando parte dall'esperienza: location comoda, cibo servito bene, audio pulito, tempi non troppo lunghi e un piano B che non sembri una punizione. Fiori e allestimenti arrivano dopo.

## Cosa imparare dai matrimoni più fotografati
I matrimoni molto osservati, anche quelli VIP, funzionano quando sembrano coerenti: pochi segni forti, privacy, ospitalità e una narrazione chiara. Non serve copiare lusso e scenografie; serve capire cosa rende memorabile una giornata.

## Domande da fare prima di scegliere
Chiedi alla location come gestisce flussi, meteo, musica, parcheggio e fornitori esterni. Chiedi al catering come cambia il servizio con invitati reali, intolleranze e ritardi. Chiedi al DJ o alla band come leggono pubblici diversi.`,
    faqs: [
      {
        question: "Qual è il trend matrimonio più importante per il 2026?",
        answer:
          "La personalizzazione utile: scelte estetiche e organizzative che migliorano davvero l'esperienza degli invitati."
      },
      {
        question: "Conviene investire prima in decorazioni o servizio?",
        answer:
          "Per un evento riuscito conviene mettere prima in sicurezza servizio, cibo, audio, comfort e piano B."
      }
    ]
  },
  {
    title: "Quanto costa davvero un evento privato: le voci che nessuno legge",
    slug: "quanto-costa-evento-privato-voci-nascoste",
    kicker: "Budget",
    excerpt:
      "Sala, catering e musica sono solo l'inizio. Le differenze vere spesso stanno in personale, orari extra, trasporto, pulizie, sicurezza e noleggi.",
    category: "Costi",
    tags: "quanto costa evento,budget evento,preventivo location,catering,open bar",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Appunti e budget per pianificare un evento",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 5,
    metaTitle: "Quanto costa un evento privato: voci nascoste da controllare",
    metaDescription:
      "Scopri le voci nascoste nei preventivi per eventi privati: location, catering, musica, open bar, personale, pulizie e orari extra.",
    aiSummary:
      "Un preventivo evento va letto per voci: prezzo base, servizi inclusi, extra possibili, penali, numero minimo garantito e condizioni di pagamento.",
    keyTakeaways:
      "Confronta sempre preventivi con gli stessi dati.\nChiedi cosa è incluso e cosa resta extra.\nIl costo a persona non racconta tutto.\nMetti un tetto agli extra a consumo.",
    content: `## Il prezzo finale non basta
Due preventivi da 3.000 euro possono essere molto diversi. Uno include pulizie, personale, audio e arredi; l'altro no. La prima regola è chiedere una tabella con voci separate.

## Le voci che fanno salire il conto
Orari extra, trasporto, montaggio, personale, sicurezza, guardaroba, tecnico audio, noleggio tavoli, ghiaccio, bicchieri e pulizie sono spesso decisivi. Anche l'IVA può cambiare la percezione del prezzo.

## Come chiedere un preventivo leggibile
Scrivi data, zona, numero persone, orari, tipo evento, budget massimo, servizi richiesti e stile desiderato. Chiedi una risposta divisa per voci e una riga su cosa non è incluso.

## Quando chiedere aiuto alla community
Se un preventivo ti sembra alto, pubblicalo senza dati sensibili: città, numero persone, cosa include e dubbi principali. Le risposte saranno molto più precise.`,
    faqs: [
      {
        question: "Quanti preventivi dovrei confrontare?",
        answer: "Almeno tre per categoria importante, usando gli stessi dati per tutti."
      },
      {
        question: "Il prezzo a persona è sufficiente?",
        answer: "No. Devi sapere se include personale, bevande, attrezzature, trasporto, IVA e orari extra."
      }
    ]
  },
  {
    title: "Matrimoni VIP e destination wedding: cosa copiare davvero",
    slug: "matrimoni-vip-destination-wedding-cosa-copiare",
    kicker: "Ispirazione",
    excerpt:
      "Dai matrimoni più osservati non conviene copiare il lusso, ma metodo: privacy, accoglienza, timeline, identità visiva e cura degli ospiti.",
    category: "Matrimoni VIP",
    tags: "matrimoni vip,destination wedding,matrimonio italia,guest experience,location matrimonio",
    heroImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Matrimonio elegante con dettagli raffinati",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 7,
    metaTitle: "Matrimoni VIP e destination wedding: idee utili da copiare",
    metaDescription:
      "Cosa imparare dai matrimoni VIP e destination wedding: privacy, location, ospitalità, timeline, budget e idee applicabili a eventi reali.",
    aiSummary:
      "I matrimoni VIP sono utili come studio organizzativo: mostrano quanto contino privacy, viaggio degli invitati, coerenza estetica e gestione dei momenti.",
    keyTakeaways:
      "Non copiare il lusso, copia la chiarezza.\nLa privacy è un servizio, non solo un vezzo.\nDestination wedding significa logistica prima di estetica.\nLa timeline deve proteggere gli ospiti dalla fatica.",
    content: `## Il punto non è fare un matrimonio da copertina
I matrimoni più osservati fanno sognare, ma la parte utile è meno appariscente: ospiti guidati bene, spostamenti semplici, momenti chiari, privacy e un'identità estetica coerente.

## Destination wedding: la logistica è il vero lusso
Se gli invitati devono viaggiare, servono informazioni precise: dove dormire, come arrivare, quando muoversi, cosa aspettarsi, come vestirsi e chi contattare in caso di problema.

## Privacy e ritmo
Un evento elegante non è necessariamente grande. Può essere raccolto, protetto, con fotografie curate ma non invadenti e una timeline che lascia respiro.

## Come adattarlo a un budget normale
Scegli un solo segno forte: una location con carattere, una cena memorabile, musica molto curata o una tavola perfetta. Il resto deve sostenere quel segno, non competere.`,
    faqs: [
      {
        question: "Cosa si può copiare da un matrimonio VIP senza spendere troppo?",
        answer:
          "Metodo e coerenza: informazioni chiare agli ospiti, timeline fluida, privacy, comfort e un segno estetico forte."
      },
      {
        question: "Il destination wedding conviene?",
        answer:
          "Conviene se la logistica è semplice e se gli ospiti ricevono supporto su viaggio, alloggio e tempi."
      }
    ]
  },
  {
    title: "Eventi aziendali 2026: meno palco, più relazione",
    slug: "eventi-aziendali-2026-meno-palco-piu-relazione",
    kicker: "Corporate",
    excerpt:
      "Meeting, cene clienti e team building stanno diventando più concreti: meno agenda piena, più networking, contenuti utili e momenti di relazione.",
    category: "Eventi aziendali",
    tags: "eventi aziendali 2026,team building,cena aziendale,networking,event planning",
    heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Evento aziendale con team e networking",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 5,
    metaTitle: "Eventi aziendali 2026: trend e consigli pratici",
    metaDescription:
      "Trend eventi aziendali 2026: networking, team building, agenda, location, catering e format più relazionali.",
    aiSummary:
      "Gli eventi aziendali efficaci riducono i momenti passivi e aumentano networking, comfort, chiarezza degli obiettivi e contenuti davvero utili.",
    keyTakeaways:
      "Parti dall'obiettivo prima della location.\nLascia tempo reale per networking.\nEvita team building imbarazzanti.\nMisura successo con feedback e relazioni create.",
    content: `## L'evento aziendale non deve sembrare una giornata infinita
Il problema più comune è riempire tutto: talk, presentazioni, speech, cena, musica, premiazioni. Il risultato è stanchezza. Un buon evento aziendale lascia respiro.

## Networking progettato
Il networking non nasce da solo. Servono pause vere, spazi comodi, cibo facile da gestire e un motivo per parlare con persone nuove senza sentirsi obbligati.

## Team building più leggero
Funzionano attività inclusive: cucina, degustazioni, workshop pratici, esperienze brevi. Da evitare format che mettono in imbarazzo chi è più riservato.

## Budget e ritorno
Non misurare solo presenze. Chiedi feedback, osserva conversazioni nate durante la serata, contatti utili e qualità percepita da team o clienti.`,
    faqs: [
      {
        question: "Quanto tempo lasciare al networking?",
        answer: "Per eventi medi, almeno 25-30 minuti per pausa e circa 60 minuti per aperitivo finale."
      },
      {
        question: "Qual è un team building sicuro?",
        answer: "Un'attività inclusiva, non competitiva e non fisica, come degustazione o cooking class."
      }
    ]
  },
  {
    title: "Food experience: perché il menu è diventato il cuore dell'evento",
    slug: "food-experience-menu-cuore-evento",
    kicker: "Catering",
    excerpt:
      "Buffet, cena servita, isole food e open bar raccontano il tono dell'evento. Ma il menu deve essere scenografico solo se resta comodo.",
    category: "Catering",
    tags: "food experience,catering evento,menu matrimonio,buffet,open bar",
    heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Catering elegante preparato per evento",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 6,
    metaTitle: "Food experience per eventi: menu, buffet e catering",
    metaDescription:
      "Come progettare food experience per eventi: buffet, menu, open bar, servizio, intolleranze e consigli per evitare errori.",
    aiSummary:
      "Il cibo funziona quando sostiene ritmo e comfort dell'evento. Le scelte scenografiche devono essere bilanciate da servizio, quantità e logistica.",
    keyTakeaways:
      "Il menu comunica lo stile dell'evento.\nIl buffet richiede più punti e personale.\nL'open bar va limitato o controllato.\nIntolleranze e bambini vanno gestiti prima.",
    content: `## Il menu non è solo cosa si mangia
È ritmo, attesa, conversazione, energia. Un buffet può rendere la festa dinamica, ma se crea code diventa il problema principale.

## Quando scegliere buffet
Il buffet funziona con più punti di servizio, personale presente e spazi ampi. Per gruppi sopra 50 persone, un solo tavolo è quasi sempre poco.

## Cena servita o formula mista
La cena servita è più ordinata. Una formula mista può essere ideale: aperitivo o antipasti a buffet, poi una portata servita e dolce finale.

## Open bar senza sorprese
Decidi durata, lista drink, numero bartender e tetto massimo. Un open bar non controllato può cambiare completamente il budget.`,
    faqs: [
      {
        question: "Buffet o cena servita per 60 persone?",
        answer: "Buffet solo se ci sono più punti e personale. Altrimenti meglio formula mista."
      },
      {
        question: "Cosa va scritto prima di confermare l'open bar?",
        answer: "Definisci durata, lista drink, numero bartender e tetto massimo scritto."
      }
    ]
  },
  {
    title: "Come trasformare un'idea evento in un format realizzabile",
    slug: "trasformare-idea-evento-in-format-realizzabile",
    kicker: "Idee evento",
    excerpt:
      "Un'idea bella non basta. Deve diventare format: obiettivo, pubblico, ritmo, budget, fornitori e piano B.",
    category: "Idee evento",
    tags: "idee evento,format evento,organizzare evento,esperienza ospiti",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Evento serale con luci e atmosfera",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 5,
    metaTitle: "Come trasformare un'idea evento in un format realizzabile",
    metaDescription:
      "Metodo pratico per trasformare un'idea evento in un format: obiettivo, budget, location, fornitori, timeline e piano B.",
    aiSummary:
      "Per rendere fattibile un'idea evento bisogna tradurla in format: pubblico, obiettivo, budget, spazi, tempi e fornitori necessari.",
    keyTakeaways:
      "Una buona idea deve avere un obiettivo chiaro.\nIl format descrive cosa succede minuto per minuto.\nIl budget va diviso per priorità.\nIl piano B va pensato prima.",
    content: `## Dall'ispirazione al format
Molte idee sembrano belle finché restano immagini. Diventano eventi quando rispondono a domande concrete: per chi è, quanto dura, dove avviene, chi serve, cosa costa.

## La struttura minima
Scrivi obiettivo, pubblico, durata, budget, location ideale, cibo, musica, attività, fornitori e piano B. Se non riesci a descriverlo, l'idea non è ancora pronta.

## Cosa chiedere alla community
Racconta il format in poche righe e chiedi dove potrebbe rompersi: costi, logistica, tempi, meteo, fornitori o ospiti.

## Quando semplificare
Se servono troppi fornitori o troppi passaggi, scegli un elemento forte e rendi tutto il resto più semplice.`,
    faqs: [
      {
        question: "Come capisco se un'idea evento è realizzabile?",
        answer: "Se puoi descrivere pubblico, budget, luogo, timeline e fornitori necessari, è già abbastanza concreta."
      },
      {
        question: "Meglio un evento originale o semplice?",
        answer: "Meglio originale solo dove serve. La semplicità aiuta gli ospiti a vivere meglio l'esperienza."
      }
    ]
  },
  {
    title: "Compleanno adulto elegante: idee, budget e location senza effetto improvvisato",
    slug: "compleanno-adulto-elegante-idee-budget-location",
    kicker: "Feste private",
    excerpt:
      "Una guida pratica per organizzare un compleanno adulto curato: atmosfera, inviti, location, menu, musica e budget senza cadere nel solito aperitivo.",
    category: "Feste private",
    tags: "compleanno adulto elegante,festa privata,idee compleanno,budget compleanno,location compleanno",
    heroImage: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Tavola colorata per festa privata elegante",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 6,
    metaTitle: "Compleanno adulto elegante: idee, budget e location",
    metaDescription:
      "Come organizzare un compleanno adulto elegante: idee, budget, location, menu, musica, inviti e consigli pratici per una festa curata.",
    aiSummary:
      "Un compleanno adulto funziona quando ha un tono chiaro: cena, aperitivo, esperienza o festa ballata. Budget e location vanno scelti in base a comfort, orari e servizio.",
    keyTakeaways:
      "Scegli prima il tono della festa.\nLa location deve risolvere rumore, orari e pulizie.\nMeglio un dettaglio forte che tante decorazioni scollegate.\nIl budget va diviso tra cibo, musica e servizio.",
    content: `## Parti dal tono, non dalla decorazione
Prima di pensare ad allestimenti e dettagli, decidi che serata vuoi: cena elegante, aperitivo lungo, festa con DJ, degustazione o esperienza più raccolta. Questa scelta guida tutto il resto.

## Location: cosa controllare
Per una festa adulta contano orari, rumore, parcheggio, bagni, servizio, esclusiva e possibilità di musica. Una sala bellissima ma rigida sugli orari può rovinare l'atmosfera.

## Budget intelligente
Metti al sicuro cibo, bevande, musica e personale. Le decorazioni arrivano dopo e dovrebbero rafforzare un'idea sola: tavola, luci, angolo foto o torta.

## Come chiedere aiuto alla community
Scrivi città, numero persone, fascia budget, orario e tipo di festa desiderata. Le risposte saranno molto più utili se chiedi un confronto tra due o tre opzioni reali.`,
    faqs: [
      {
        question: "Quanto prima prenotare una location per compleanno adulto?",
        answer: "Per date richieste o weekend conviene muoversi almeno 2-3 mesi prima, di più se vuoi una location specifica."
      },
      {
        question: "Meglio DJ o playlist per una festa privata?",
        answer: "Playlist se la festa resta tranquilla; DJ se vuoi gestire energia, ballo, microfoni e momenti della serata."
      }
    ]
  },
  {
    title: "Diciottesimo 2026: musica, sicurezza, open bar e genitori senza caos",
    slug: "diciottesimo-2026-musica-sicurezza-open-bar-genitori",
    kicker: "Feste private",
    excerpt:
      "Il diciottesimo sembra semplice, ma richiede regole chiare: orari, alcolici, sicurezza, DJ, responsabilità e comunicazione con invitati e famiglie.",
    category: "Feste private",
    tags: "diciottesimo 2026,organizzare diciottesimo,festa 18 anni,open bar diciottesimo,dj diciottesimo",
    heroImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Palloncini colorati per festa di compleanno",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 6,
    metaTitle: "Diciottesimo 2026: come organizzarlo senza caos",
    metaDescription:
      "Guida per organizzare un diciottesimo nel 2026: location, DJ, open bar, sicurezza, genitori, budget e regole pratiche.",
    aiSummary:
      "Un diciottesimo va gestito come un evento vero: serve chiarezza su alcolici, orari, sicurezza, musica, responsabilità e numero finale di invitati.",
    keyTakeaways:
      "Metti per iscritto regole su alcolici e orari.\nScegli una location abituata ai diciottesimi.\nIl DJ deve conoscere pubblico e limiti della sala.\nServe un adulto referente il giorno dell'evento.",
    content: `## Perché il diciottesimo va organizzato bene
Il problema non è solo fare una bella festa, ma tenere insieme entusiasmo, sicurezza e responsabilità. Location e fornitori devono sapere che tipo di pubblico arriverà.

## Musica e orari
Il DJ va scelto chiedendo playlist, gestione richieste, microfono, impianto e orario massimo. Se la sala ha limiti acustici, vanno chiariti prima.

## Open bar e alcolici
Meglio definire formule chiare: drink inclusi, fascia oraria, cosa resta escluso, chi controlla e cosa succede se si supera il budget.

## Genitori e referenti
Serve una persona adulta che abbia contatti di location, DJ e catering. Il giorno della festa non tutto può passare dal festeggiato.`,
    faqs: [
      {
        question: "Serve sicurezza per un diciottesimo?",
        answer: "Dipende da numero invitati e location, ma va sempre chiesto chi gestisce ingresso, uscita e situazioni delicate."
      },
      {
        question: "Come evitare extra con open bar?",
        answer: "Stabilisci drink inclusi, durata, prezzo massimo, responsabile e modalità di pagamento prima della festa."
      }
    ]
  },
  {
    title: "Open bar per eventi: quanto costa e cosa scrivere nel contratto",
    slug: "open-bar-eventi-quanto-costa-contratto",
    kicker: "Budget",
    excerpt:
      "L'open bar può cambiare completamente il conto finale. Ecco formule, voci da controllare, rischi e domande da fare prima di confermare.",
    category: "Costi",
    tags: "open bar eventi,quanto costa open bar,contratto open bar,budget festa,catering bevande",
    heroImage: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Bancone bar con cocktail preparati per evento",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 5,
    metaTitle: "Open bar per eventi: costi, formule e contratto",
    metaDescription:
      "Quanto costa un open bar per eventi e feste: formule, durata, bartender, consumi, extra e clausole da mettere nel contratto.",
    aiSummary:
      "L'open bar va definito con durata, drink inclusi, numero bartender, ghiaccio, bicchieri, trasporto, tetto massimo e gestione degli extra.",
    keyTakeaways:
      "Chiedi sempre cosa include la formula.\nMetti un limite agli extra a consumo.\nVerifica bartender, ghiaccio, bicchieri e logistica.\nLa durata cambia molto il costo.",
    content: `## Open bar non significa sempre la stessa cosa
Alcuni preventivi includono solo drink base, altri cocktail più complessi, bartender, ghiaccio, bicchieri e trasporto. Senza dettagli, il confronto non vale.

## Le formule più comuni
Puoi trovare prezzo a persona, pacchetto a ore, consumo minimo o formula a consumo. Per feste private, un tetto massimo scritto evita sorprese.

## Cosa mettere per iscritto
Durata, lista drink, numero bartender, materiale incluso, allestimento, smontaggio, trasporto, IVA, extra e modalità di chiusura del servizio.

## Quando chiedere un confronto
Se hai due formule diverse, pubblica numero persone, durata, città e cosa include ogni proposta. La community può aiutarti a capire quale è più chiara.`,
    faqs: [
      {
        question: "Meglio open bar a persona o a consumo?",
        answer: "A persona è più prevedibile; a consumo può convenire solo con invitati moderati e tetto massimo scritto."
      },
      {
        question: "Quanti bartender servono?",
        answer: "Dipende dai drink e dal ritmo, ma per evitare code va chiesto sempre il rapporto bartender/ospiti."
      }
    ]
  },
  {
    title: "Destination wedding in Italia: checklist per ospiti, location e weekend",
    slug: "destination-wedding-italia-checklist-ospiti-location-weekend",
    kicker: "Ispirazione",
    excerpt:
      "Un matrimonio fuori zona non è solo una location bella: servono informazioni, camere, trasporti, tempi, privacy e un piano per gli ospiti.",
    category: "Matrimoni VIP",
    tags: "destination wedding Italia,matrimonio fuori regione,wedding weekend,ospiti matrimonio,location matrimonio Italia",
    heroImage: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Tavolo elegante all'aperto per matrimonio in Italia",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 7,
    metaTitle: "Destination wedding in Italia: checklist pratica",
    metaDescription:
      "Checklist destination wedding in Italia: ospiti, location, camere, trasporti, timeline, budget, piano B e consigli pratici.",
    aiSummary:
      "Un destination wedding funziona se gli ospiti sono guidati bene: viaggio, alloggio, tempi, dress code, trasporti, contatti e piano B devono essere chiari.",
    keyTakeaways:
      "La logistica viene prima dell'estetica.\nPrepara una pagina o messaggio unico per gli ospiti.\nBlocca camere e trasporti il prima possibile.\nIl piano B deve essere bello, non solo tecnico.",
    content: `## Il vero lusso è non far perdere gli ospiti
Se le persone devono spostarsi, la cura sta nelle informazioni: come arrivare, dove dormire, quando muoversi, cosa portare e chi chiamare.

## Location e camere
Verifica se la location ha alloggi, convenzioni vicine, navette, parcheggi e orari realistici. La bellezza del posto non basta se gli ospiti sono stanchi.

## Wedding weekend
Se vuoi distribuire l'evento su più momenti, chiarisci cosa è obbligatorio e cosa facoltativo. Non tutti avranno lo stesso budget o tempo.

## Privacy e contenuti
Se vuoi un evento riservato, comunicalo con gentilezza: foto, social, momenti privati e ruolo del fotografo vanno spiegati prima.`,
    faqs: [
      {
        question: "Quanto prima organizzare un destination wedding?",
        answer: "Meglio 12-18 mesi prima se ci sono ospiti che viaggiano, camere da bloccare e alta stagione."
      },
      {
        question: "Serve una navetta?",
        answer: "Spesso sì, soprattutto se cena, festa e alloggi non sono nello stesso luogo."
      }
    ]
  },
  {
    title: "Cena aziendale con clienti: format elegante senza effetto convention",
    slug: "cena-aziendale-clienti-format-elegante",
    kicker: "Corporate",
    excerpt:
      "Una cena clienti deve favorire relazione e fiducia, non sembrare una presentazione infinita. Format, tavoli, tempi e contenuti fanno la differenza.",
    category: "Eventi aziendali",
    tags: "cena aziendale clienti,eventi corporate,format cena aziendale,networking clienti,evento business",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=84",
    heroAlt: "Evento aziendale serale con tavoli e luci calde",
    authorName: "Redazione OrganizzaEvento",
    readingMinutes: 6,
    metaTitle: "Cena aziendale con clienti: format elegante e pratico",
    metaDescription:
      "Come organizzare una cena aziendale con clienti: format, networking, location, tavoli, discorsi, menu e tempi giusti.",
    aiSummary:
      "Una cena clienti funziona se i contenuti sono brevi, i tavoli sono pensati, il menu è comodo e il networking è facilitato senza forzature.",
    keyTakeaways:
      "Evita discorsi lunghi durante la cena.\nProgetta tavoli e momenti di relazione.\nScegli un menu facile da mangiare parlando.\nChiudi con follow-up chiaro e non invasivo.",
    content: `## Meno palco, più relazione
Una cena clienti non deve trasformarsi in una convention seduta. I contenuti funzionano se sono brevi, ben posizionati e utili.

## Tavoli e ritmo
La disposizione dei tavoli può aiutare o bloccare le conversazioni. Mescola persone con criterio e lascia pause vere tra una portata e l'altra.

## Menu e servizio
Il menu deve essere elegante ma comodo. Piatti troppo complessi o tempi lunghi rendono difficile parlare e restare concentrati.

## Dopo l'evento
Prepara un follow-up gentile: ringraziamento, eventuali materiali promessi e contatto diretto. L'evento continua anche dopo la cena.`,
    faqs: [
      {
        question: "Quanto deve durare un discorso in una cena clienti?",
        answer: "Meglio pochi minuti, con messaggio chiaro. Se serve contenuto più lungo, meglio farlo prima della cena."
      },
      {
        question: "Come favorire networking senza forzare?",
        answer: "Con tavoli pensati, pause reali, accoglienza curata e persone interne pronte a introdurre gli ospiti."
      }
    ]
  }
] as const;

async function main() {
  const seedIfEmpty = process.env.SEED_IF_EMPTY === "true";
  const existingQuestions = await prisma.question.count();

  if (seedIfEmpty && existingQuestions > 0) {
    console.log(`Seed saltato: il database contiene già ${existingQuestions} domande.`);
    return;
  }

  await prisma.editorialArticle.deleteMany();
  await prisma.report.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();

  const categoryRecords = new Map<string, { id: string }>();

  for (const category of CATEGORIES) {
    const record = await prisma.category.create({ data: category });
    categoryRecords.set(category.slug, record);
  }

  for (const [index, question] of allQuestions.entries()) {
    const category = categoryRecords.get(question.categorySlug);
    if (!category) throw new Error(`Categoria mancante: ${question.categorySlug}`);
    const author = authorProfiles[index % authorProfiles.length];

    const createdQuestion = await prisma.question.create({
      data: {
        title: question.title,
        slug: slugify(question.title),
        content: question.content,
        categoryId: category.id,
        postType: question.postType,
        eventPhase: eventPhaseForQuestion(question),
        eventType: question.eventType,
        city: question.city,
        region: question.region,
        peopleCount: question.peopleCount,
        budgetRange: question.budgetRange,
        displayMode: author.displayMode,
        displayName: author.displayName,
        usefulVotes: question.usefulVotes,
        notUsefulVotes: Math.floor(index / 7),
        answersCount: question.answers.length,
        createdAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 60 * 18)
      }
    });

    for (const [answerIndex, answer] of question.answers.entries()) {
      const answerAuthor = answerProfiles[(index + answerIndex) % answerProfiles.length];
      await prisma.answer.create({
        data: {
          questionId: createdQuestion.id,
          content: answer,
          displayMode: answerAuthor.displayMode,
          displayName: answerAuthor.displayName,
          usefulVotes: Math.max(2, question.usefulVotes - answerIndex * 4),
          notUsefulVotes: answerIndex === 0 ? 0 : 1,
          isBestAnswer: answerIndex === 0 && question.answers.length > 1,
          createdAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 60 * 12)
        }
      });
    }
  }

  for (const [index, article] of editorialArticles.entries()) {
    const { faqs, ...articleData } = article;
    await prisma.editorialArticle.create({
      data: {
        ...articleData,
        faqJson: JSON.stringify(faqs),
        publishedAt: new Date(Date.now() - index * 3 * 24 * 60 * 60 * 1000),
        status: "published"
      }
    });
  }

  const answersCount = allQuestions.reduce((total, question) => total + question.answers.length, 0);
  console.log(
    `Seed completato: ${CATEGORIES.length} categorie, ${allQuestions.length} domande, ${answersCount} risposte, ${editorialArticles.length} articoli.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
