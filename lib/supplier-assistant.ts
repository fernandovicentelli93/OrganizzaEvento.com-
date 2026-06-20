type SupplierAssistantInput = {
  eventType: string;
  city?: string | null;
  region?: string | null;
  eventDate?: Date | null;
  peopleCount?: number | null;
  budgetRange?: string | null;
  supplierTypes: string[];
  message: string;
  name?: string | null;
};

function missingData(input: SupplierAssistantInput) {
  const missing = [];
  if (!input.city && !input.region) missing.push("zona precisa dell'evento");
  if (!input.eventDate) missing.push("data o periodo indicativo");
  if (!input.peopleCount) missing.push("numero indicativo di persone");
  if (!input.budgetRange) missing.push("budget massimo o fascia desiderata");
  return missing;
}

function supplierAdvice(supplierTypes: string[]) {
  const normalized = supplierTypes.join(" ").toLowerCase();
  const advice = [];

  if (normalized.includes("location")) {
    advice.push("per la location controlla capienza reale, orari, piano B, parcheggio, esclusiva e costi extra");
  }

  if (normalized.includes("catering") || normalized.includes("open bar")) {
    advice.push("per catering e bar chiedi menu, personale incluso, durata servizio, intolleranze e consumi extra");
  }

  if (normalized.includes("musica") || normalized.includes("dj")) {
    advice.push("per musica e DJ verifica impianto, orari, SIAE, scaletta libera e gestione dei momenti chiave");
  }

  if (normalized.includes("foto") || normalized.includes("video")) {
    advice.push("per foto e video chiedi ore di copertura, tempi consegna, numero scatti e diritti di utilizzo");
  }

  if (normalized.includes("allestimenti") || normalized.includes("animazione")) {
    advice.push("per allestimenti e animazione serve capire spazi, tempi di montaggio e cosa resta escluso");
  }

    return advice.length ? advice : ["prima di contattare fornitori prepara una richiesta unica con dati, budget e priorità"];
}

export function generateSupplierAssistantReply(input: SupplierAssistantInput) {
  const place = [input.city, input.region].filter(Boolean).join(", ") || "zona da definire";
  const missing = missingData(input);
  const advice = supplierAdvice(input.supplierTypes);
  const greeting = input.name ? `Ciao ${input.name},` : "Ciao,";

  return [
    `${greeting} ho letto la richiesta per ${input.eventType.toLowerCase()} in ${place}.`,
    `Per partire bene contatterei prima ${input.supplierTypes.join(", ")} con una scheda unica, così i preventivi saranno confrontabili e non basati su informazioni diverse.`,
    `Prossimi passi consigliati: ${advice.join("; ")}.`,
    missing.length
      ? `Prima di inviare la richiesta ai fornitori mancano ancora: ${missing.join(", ")}.`
      : "La richiesta contiene già i dati minimi per iniziare a confrontare fornitori in modo ordinato.",
    "Nota interna: controlla questa bozza prima di inviarla al cliente via email."
  ].join("\n\n");
}
