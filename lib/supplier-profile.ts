export const supplierCategories = [
  "Location",
  "Catering e banqueting",
  "Wedding planner / event planner",
  "Musica, DJ e intrattenimento",
  "Foto e video",
  "Allestimenti e fiori",
  "Open bar e beverage",
  "Animazione bambini",
  "Audio, luci e tecnica",
  "Noleggi e arredi",
  "Grafica, inviti e stationery",
  "Altro servizio eventi"
];

export const supplierEventTypes = [
  "Matrimoni",
  "Compleanni",
  "Diciottesimi",
  "Lauree",
  "Feste private",
  "Cene private",
  "Eventi aziendali",
  "Team building",
  "Anniversari",
  "Altro"
];

export const supplierPriceRanges = [
  "Economico / essenziale",
  "Medio",
  "Medio-alto",
  "Premium",
  "Su preventivo"
];

export const supplierTravelRanges = [
  "Solo città o provincia",
  "Fino a 50 km",
  "Fino a 100 km",
  "Tutta la regione",
  "Più regioni",
  "Tutta Italia"
];

export function splitStoredList(value?: string | null) {
  return (value ?? "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinStoredList(values: string[]) {
  return values
    .map((item) => item.trim())
    .filter(Boolean)
    .join("|");
}
