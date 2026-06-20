const statuses = [
  {
    label: "Aggiornamento dell'autore",
    note: "L'autore ha aggiunto dettagli utili dopo le prime risposte."
  },
  {
    label: "Alla fine ho scelto...",
    note: "La conversazione contiene una decisione finale o un confronto molto concreto."
  },
  {
    label: "Problema risolto",
    note: "Le risposte hanno aiutato a chiarire il prossimo passo."
  },
  {
    label: "Preventivo rifiutato",
    note: "Utile per capire quando una proposta non torna."
  },
  {
    label: "Evento concluso",
    note: "Chi ha scritto ha raccontato cosa ? successo dopo."
  }
];

function hash(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function conversationStatus(slug: string, answersCount: number, postType?: string) {
  if (answersCount < 3) return null;
  if (postType === "Preventivo") return statuses[3];
  return statuses[hash(slug) % statuses.length];
}
