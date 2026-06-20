const titleOverrides: Record<string, string> = {
  "Quanto costa un DJ per un diciottesimo con 80 persone":
    "DJ per diciottesimo: 80 invitati, 5 ore e luci base",
  "Quanto costa un catering per 50 persone":
    "Buffet per 50 invitati: stesso menù, due prezzi lontanissimi",
  "Quanto costa organizzare una cena aziendale":
    "Cena aziendale a Padova: il prezzo sembra ok, ma cosa resta fuori",
  "Quanto costa una band per matrimonio":
    "Band per matrimonio: il preventivo cambia appena aggiungo il DJ",
  "Quanto costa un fotografo per evento":
    "Fotografo per conferenza: mi serve davvero la giornata intera",
  "Quanto costa un open bar":
    "Open bar dopo cena: meglio prezzo chiuso o tetto massimo",
  "DJ per diciottesimo con 80 invitati: 700-900 euro sono realistici":
    "DJ per diciottesimo: 80 invitati, 5 ore e luci base",
  "Catering per 50 invitati: perché due preventivi cambiano così tanto":
    "Buffet per 50 invitati: stesso menù, due prezzi lontanissimi",
  "Cena aziendale: 60 euro a persona bastano o mancano gli extra":
    "Cena aziendale a Padova: il prezzo sembra ok, ma cosa resta fuori",
  "Band matrimonio: quando 1.500 euro sono pochi e quando sono troppi":
    "Band per matrimonio: il preventivo cambia appena aggiungo il DJ",
  "Fotografo per evento: mezza giornata, consegna rapida e prezzo giusto":
    "Fotografo per conferenza: mi serve davvero la giornata intera",
  "Open bar: pacchetto fisso o consumo, dove si rischia il contó finale":
    "Open bar dopo cena: meglio prezzo chiuso o tetto massimo",
  "DJ per diciottesimo: 750 euro sono troppi":
    "DJ per diciottesimo a Roma: 750 euro con luci base",
  "Catering per 50 persone: mi hanno chiesto 2.900 euro, ci sta":
    "Buffet per 50 persone: il catering mi ha mandato 2.900 euro",
  "Cena aziendale di fine anno: 60 euro a persona ? realistico":
    "Cena aziendale di fine anno: il ristorante include davvero tutto",
  "animazione e intrattenimento: preventivo da 1.200-1.800 euro, ? realistico":
    "Animazione a Napoli: show, DJ set e montaggio non tornano",
  "audio video per conferenza: preventivo da 3.000-4.200 euro, ? realistico":
    "Audio video per conferenza: le prove tecniche sono fuori preventivo",
  "band matrimonio: preventivo da 3.800-5.200 euro, ? realistico":
    "Band matrimonio a Como: il prezzo include davvero tutta la serata",
  "catering: preventivo da 4.600-5.400 euro, ? realistico":
    "Catering a Roma: buffet ricco, ma bevande e servizio serale pesano",
  "Cena privata: 3.000-4.100 euro bastano davvero":
    "Cena privata a Palermo: chef, calici e pulizia da mettere in chiaro",
  "chef privato: preventivo da 2.900-3.600 euro, ? realistico":
    "Chef privato a Lucca: menù bello, servizio al tavolo à parte",
  "Compleanno: 6.000-8.500 euro bastano davvero":
    "Compleanno a Milano: bar e musica stanno gonfiando il preventivo",
  "DJ e luci: preventivo da 750-1.100 euro, ? realistico":
    "DJ e luci a Milano: cinque ore scritte, extra ancora vaghi",
  "event planner: preventivo da 4.500-6.500 euro, ? realistico":
    "Wedding planner a Siena: fee chiaro, incontri da chiarire",
  "Evento aziendale: 14.000-19.000 euro bastano davvero":
    "Evento aziendale a Torino: sala, audio e accoglienza nello stesso budget",
  "fiori e allestimento: preventivo da 3.500-4.800 euro, ? realistico":
    "Fiori a Lecce: quando arco e candele fanno salire il contó",
  "fotografo: preventivo da 2.500-3.400 euro, ? realistico":
    "Fotografo matrimonio a Verona: trasferta e consegna restano aperte",
  "Laurea: 2.200-3.400 euro bastano davvero":
    "Laurea a Padova: aperitivo, torta e musica senza sforare",
  "location: preventivo da 5.800-7.200 euro, ? realistico":
    "Villa a Firenze: il costo vero esce tra sicurezza e piano B",
  "Matrimonio: 22.000-31.000 euro bastano davvero":
    "Matrimonio a Roma: sto dividendo il budget prima di bloccare la villa",
  "open bar: preventivo da 2.400-3.200 euro, ? realistico":
    "Open bar a Bologna: pacchetto chiaro, premium e dopo mezzanotte no",
  "Team building: 5.500-7.500 euro bastano davvero":
    "Team building a Bari: attività, pranzo e materiali nello stesso preventivo",
  "transfer ospiti: preventivo da 1.900-2.600 euro, ? realistico":
    "Transfer ospiti a Bologna: bagagli e attese non sono dettagli piccoli",
  "Quanto costa animazione e intrattenimento per festa privata a Napoli":
    "Intrattenimento a Napoli: performer, DJ set e spazio da verificare",
  "Quanto costa audio video per conferenza per evento aziendale a Torino":
    "Conferenza a Torino: audio, schermi e tecnico prima del preventivo",
  "Quanto costa band matrimonio per matrimonio a Como":
    "Band matrimonio a Como: aperitivo live, cena e festa senza buchi",
  "Quanto costa catering per cena privata a Roma":
    "Catering a Roma: buffet, staff e bevande da leggere separati",
  "Quanto costa chef privato per anniversario a Lucca":
    "Chef privato per anniversario: menù, spesa e pulizia non sono la stessa cosa",
  "Quanto costa DJ e luci per diciottesimo a Milano":
    "DJ e luci a Milano: microfono incluso, ore extra da scrivere",
  "Quanto costa event planner per matrimonio a Siena":
    "Planner a Siena: timeline e sopralluoghi dentro il fee",
  "Quanto costa fiori e allestimento per matrimonio a Lecce":
    "Fiori matrimonio a Lecce: bouquet e arco non pesano uguale",
  "Quanto costa fotografo per matrimonio a Verona":
    "Fotografo a Verona: consegna rapida e secondo shooter da chiarire",
  "Quanto costa location per compleanno a Firenze":
    "Villa a Firenze: giardino, sala interna e costi nascosti",
  "Quanto costa open bar per festa privata a Bologna":
    "Open bar a Bologna: tre ore, due bartender e dubbi sul premium",
  "Quanto costa organizzare un cena privata a Palermo per 35 persone":
    "Cena privata a Palermo: quando il servizio conta più del menù",
  "Quanto costa organizzare un compleanno a Milano per 60 persone":
    "Compleanno a Milano: il totale cresce tra sala, bar e musica",
  "Quanto costa organizzare un evento aziendale a Torino per 130 persone":
    "Evento aziendale a Torino: check-in, audio e cena nello stesso budget",
  "Quanto costa organizzare un laurea a Padova per 45 persone":
    "Laurea a Padova: aperitivo rinforzato o pacchetto completo",
  "Quanto costa organizzare un matrimonio a Roma per 90 persone":
    "Matrimonio a Roma: location, catering e musica prima dei dettagli belli",
  "Quanto costa organizzare un team building a Bari per 55 persone":
    "Team building a Bari: attività e pranzo senza perdere il controllo",
  "Quanto costa transfer ospiti per evento aziendale a Bologna":
    "Transfer aziendale a Bologna: navette, attese e bagagli da scrivere"
};

export function displayQuestionTitle(title: string) {
  return titleOverrides[title] ?? title;
}
