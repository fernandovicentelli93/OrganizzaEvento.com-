export type GeoPoint = {
  lat: number;
  lng: number;
};

export type ItalianLocationMatch = {
  code: string;
  label: string;
  point: GeoPoint;
};

const PROVINCE_COORDINATES: Record<string, ItalianLocationMatch> = {
  AG: { code: "AG", label: "Agrigento", point: { lat: 37.31, lng: 13.58 } },
  AL: { code: "AL", label: "Alessandria", point: { lat: 44.91, lng: 8.62 } },
  AN: { code: "AN", label: "Ancona", point: { lat: 43.62, lng: 13.52 } },
  AO: { code: "AO", label: "Aosta", point: { lat: 45.74, lng: 7.32 } },
  AP: { code: "AP", label: "Ascoli Piceno", point: { lat: 42.85, lng: 13.58 } },
  AQ: { code: "AQ", label: "L'Aquila", point: { lat: 42.35, lng: 13.4 } },
  AR: { code: "AR", label: "Arezzo", point: { lat: 43.46, lng: 11.88 } },
  AT: { code: "AT", label: "Asti", point: { lat: 44.9, lng: 8.2 } },
  AV: { code: "AV", label: "Avellino", point: { lat: 40.91, lng: 14.79 } },
  BA: { code: "BA", label: "Bari", point: { lat: 41.12, lng: 16.87 } },
  BG: { code: "BG", label: "Bergamo", point: { lat: 45.7, lng: 9.67 } },
  BI: { code: "BI", label: "Biella", point: { lat: 45.56, lng: 8.05 } },
  BL: { code: "BL", label: "Belluno", point: { lat: 46.14, lng: 12.22 } },
  BN: { code: "BN", label: "Benevento", point: { lat: 41.13, lng: 14.78 } },
  BO: { code: "BO", label: "Bologna", point: { lat: 44.49, lng: 11.34 } },
  BR: { code: "BR", label: "Brindisi", point: { lat: 40.64, lng: 17.94 } },
  BS: { code: "BS", label: "Brescia", point: { lat: 45.54, lng: 10.22 } },
  BT: { code: "BT", label: "Barletta-Andria-Trani", point: { lat: 41.23, lng: 16.3 } },
  BZ: { code: "BZ", label: "Bolzano", point: { lat: 46.5, lng: 11.35 } },
  CA: { code: "CA", label: "Cagliari", point: { lat: 39.22, lng: 9.12 } },
  CB: { code: "CB", label: "Campobasso", point: { lat: 41.56, lng: 14.66 } },
  CE: { code: "CE", label: "Caserta", point: { lat: 41.07, lng: 14.33 } },
  CH: { code: "CH", label: "Chieti", point: { lat: 42.35, lng: 14.17 } },
  CL: { code: "CL", label: "Caltanissetta", point: { lat: 37.49, lng: 14.06 } },
  CN: { code: "CN", label: "Cuneo", point: { lat: 44.39, lng: 7.55 } },
  CO: { code: "CO", label: "Como", point: { lat: 45.81, lng: 9.09 } },
  CR: { code: "CR", label: "Cremona", point: { lat: 45.13, lng: 10.02 } },
  CS: { code: "CS", label: "Cosenza", point: { lat: 39.3, lng: 16.25 } },
  CT: { code: "CT", label: "Catania", point: { lat: 37.51, lng: 15.08 } },
  CZ: { code: "CZ", label: "Catanzaro", point: { lat: 38.91, lng: 16.59 } },
  EN: { code: "EN", label: "Enna", point: { lat: 37.57, lng: 14.28 } },
  FC: { code: "FC", label: "Forli-Cesena", point: { lat: 44.22, lng: 12.04 } },
  FE: { code: "FE", label: "Ferrara", point: { lat: 44.84, lng: 11.62 } },
  FG: { code: "FG", label: "Foggia", point: { lat: 41.46, lng: 15.55 } },
  FI: { code: "FI", label: "Firenze", point: { lat: 43.77, lng: 11.26 } },
  FM: { code: "FM", label: "Fermo", point: { lat: 43.16, lng: 13.72 } },
  FR: { code: "FR", label: "Frosinone", point: { lat: 41.64, lng: 13.35 } },
  GE: { code: "GE", label: "Genova", point: { lat: 44.41, lng: 8.93 } },
  GO: { code: "GO", label: "Gorizia", point: { lat: 45.94, lng: 13.62 } },
  GR: { code: "GR", label: "Grosseto", point: { lat: 42.76, lng: 11.11 } },
  IM: { code: "IM", label: "Imperia", point: { lat: 43.89, lng: 8.04 } },
  IS: { code: "IS", label: "Isernia", point: { lat: 41.6, lng: 14.24 } },
  KR: { code: "KR", label: "Crotone", point: { lat: 39.08, lng: 17.13 } },
  LC: { code: "LC", label: "Lecco", point: { lat: 45.86, lng: 9.4 } },
  LE: { code: "LE", label: "Lecce", point: { lat: 40.35, lng: 18.17 } },
  LI: { code: "LI", label: "Livorno", point: { lat: 43.55, lng: 10.31 } },
  LO: { code: "LO", label: "Lodi", point: { lat: 45.31, lng: 9.5 } },
  LT: { code: "LT", label: "Latina", point: { lat: 41.47, lng: 12.9 } },
  LU: { code: "LU", label: "Lucca", point: { lat: 43.84, lng: 10.5 } },
  MB: { code: "MB", label: "Monza e Brianza", point: { lat: 45.58, lng: 9.27 } },
  MC: { code: "MC", label: "Macerata", point: { lat: 43.3, lng: 13.45 } },
  ME: { code: "ME", label: "Messina", point: { lat: 38.19, lng: 15.55 } },
  MI: { code: "MI", label: "Milano", point: { lat: 45.46, lng: 9.19 } },
  MN: { code: "MN", label: "Mantova", point: { lat: 45.16, lng: 10.79 } },
  MO: { code: "MO", label: "Modena", point: { lat: 44.65, lng: 10.93 } },
  MS: { code: "MS", label: "Massa-Carrara", point: { lat: 44.04, lng: 10.14 } },
  MT: { code: "MT", label: "Matera", point: { lat: 40.67, lng: 16.6 } },
  NA: { code: "NA", label: "Napoli", point: { lat: 40.85, lng: 14.27 } },
  NO: { code: "NO", label: "Novara", point: { lat: 45.45, lng: 8.62 } },
  NU: { code: "NU", label: "Nuoro", point: { lat: 40.32, lng: 9.33 } },
  OR: { code: "OR", label: "Oristano", point: { lat: 39.9, lng: 8.59 } },
  PA: { code: "PA", label: "Palermo", point: { lat: 38.12, lng: 13.36 } },
  PC: { code: "PC", label: "Piacenza", point: { lat: 45.05, lng: 9.69 } },
  PD: { code: "PD", label: "Padova", point: { lat: 45.41, lng: 11.88 } },
  PE: { code: "PE", label: "Pescara", point: { lat: 42.46, lng: 14.21 } },
  PG: { code: "PG", label: "Perugia", point: { lat: 43.11, lng: 12.39 } },
  PI: { code: "PI", label: "Pisa", point: { lat: 43.72, lng: 10.4 } },
  PN: { code: "PN", label: "Pordenone", point: { lat: 45.96, lng: 12.66 } },
  PO: { code: "PO", label: "Prato", point: { lat: 43.88, lng: 11.1 } },
  PR: { code: "PR", label: "Parma", point: { lat: 44.8, lng: 10.33 } },
  PT: { code: "PT", label: "Pistoia", point: { lat: 43.93, lng: 10.92 } },
  PU: { code: "PU", label: "Pesaro e Urbino", point: { lat: 43.91, lng: 12.91 } },
  PV: { code: "PV", label: "Pavia", point: { lat: 45.19, lng: 9.16 } },
  PZ: { code: "PZ", label: "Potenza", point: { lat: 40.64, lng: 15.8 } },
  RA: { code: "RA", label: "Ravenna", point: { lat: 44.42, lng: 12.2 } },
  RC: { code: "RC", label: "Reggio Calabria", point: { lat: 38.11, lng: 15.65 } },
  RE: { code: "RE", label: "Reggio Emilia", point: { lat: 44.7, lng: 10.63 } },
  RG: { code: "RG", label: "Ragusa", point: { lat: 36.93, lng: 14.73 } },
  RI: { code: "RI", label: "Rieti", point: { lat: 42.4, lng: 12.86 } },
  RM: { code: "RM", label: "Roma", point: { lat: 41.9, lng: 12.5 } },
  RN: { code: "RN", label: "Rimini", point: { lat: 44.06, lng: 12.57 } },
  RO: { code: "RO", label: "Rovigo", point: { lat: 45.07, lng: 11.79 } },
  SA: { code: "SA", label: "Salerno", point: { lat: 40.68, lng: 14.77 } },
  SI: { code: "SI", label: "Siena", point: { lat: 43.32, lng: 11.33 } },
  SO: { code: "SO", label: "Sondrio", point: { lat: 46.17, lng: 9.87 } },
  SP: { code: "SP", label: "La Spezia", point: { lat: 44.1, lng: 9.82 } },
  SR: { code: "SR", label: "Siracusa", point: { lat: 37.07, lng: 15.29 } },
  SS: { code: "SS", label: "Sassari", point: { lat: 40.73, lng: 8.56 } },
  SU: { code: "SU", label: "Sud Sardegna", point: { lat: 39.17, lng: 8.52 } },
  SV: { code: "SV", label: "Savona", point: { lat: 44.31, lng: 8.48 } },
  TA: { code: "TA", label: "Taranto", point: { lat: 40.47, lng: 17.24 } },
  TE: { code: "TE", label: "Teramo", point: { lat: 42.66, lng: 13.7 } },
  TN: { code: "TN", label: "Trento", point: { lat: 46.07, lng: 11.12 } },
  TO: { code: "TO", label: "Torino", point: { lat: 45.07, lng: 7.69 } },
  TP: { code: "TP", label: "Trapani", point: { lat: 38.02, lng: 12.51 } },
  TR: { code: "TR", label: "Terni", point: { lat: 42.56, lng: 12.65 } },
  TS: { code: "TS", label: "Trieste", point: { lat: 45.65, lng: 13.77 } },
  TV: { code: "TV", label: "Treviso", point: { lat: 45.67, lng: 12.24 } },
  UD: { code: "UD", label: "Udine", point: { lat: 46.06, lng: 13.24 } },
  VA: { code: "VA", label: "Varese", point: { lat: 45.82, lng: 8.83 } },
  VB: { code: "VB", label: "Verbano-Cusio-Ossola", point: { lat: 45.94, lng: 8.55 } },
  VC: { code: "VC", label: "Vercelli", point: { lat: 45.32, lng: 8.42 } },
  VE: { code: "VE", label: "Venezia", point: { lat: 45.44, lng: 12.33 } },
  VI: { code: "VI", label: "Vicenza", point: { lat: 45.55, lng: 11.55 } },
  VR: { code: "VR", label: "Verona", point: { lat: 45.44, lng: 10.99 } },
  VT: { code: "VT", label: "Viterbo", point: { lat: 42.42, lng: 12.11 } },
  VV: { code: "VV", label: "Vibo Valentia", point: { lat: 38.68, lng: 16.1 } }
};

const LOCATION_ALIASES: Record<string, string> = Object.values(PROVINCE_COORDINATES).reduce<Record<string, string>>((accumulator, item) => {
  accumulator[normalizeGeoText(item.label)] = item.code;
  return accumulator;
}, {});

const REGION_PROVINCE_CODES: Record<string, string[]> = {
  abruzzo: ["AQ", "CH", "PE", "TE"],
  basilicata: ["MT", "PZ"],
  calabria: ["CS", "CZ", "KR", "RC", "VV"],
  campania: ["AV", "BN", "CE", "NA", "SA"],
  emiliaromagna: ["BO", "FC", "FE", "MO", "PC", "PR", "RA", "RE", "RN"],
  friuliveneziagiulia: ["GO", "PN", "TS", "UD"],
  lazio: ["FR", "LT", "RI", "RM", "VT"],
  liguria: ["GE", "IM", "SP", "SV"],
  lombardia: ["BG", "BS", "CO", "CR", "LC", "LO", "MB", "MI", "MN", "PV", "SO", "VA"],
  marche: ["AN", "AP", "FM", "MC", "PU"],
  molise: ["CB", "IS"],
  piemonte: ["AL", "AT", "BI", "CN", "NO", "TO", "VB", "VC"],
  puglia: ["BA", "BR", "BT", "FG", "LE", "TA"],
  sardegna: ["CA", "NU", "OR", "SS", "SU"],
  sicilia: ["AG", "CL", "CT", "EN", "ME", "PA", "RG", "SR", "TP"],
  toscana: ["AR", "FI", "GR", "LI", "LU", "MS", "PI", "PO", "PT", "SI"],
  trentinoaltoadige: ["BZ", "TN"],
  umbria: ["PG", "TR"],
  valledaosta: ["AO"],
  veneto: ["BL", "PD", "RO", "TV", "VE", "VI", "VR"]
};

const REGION_ALIASES: Record<string, string> = {
  emilia: "emiliaromagna",
  emiliaromagna: "emiliaromagna",
  "emilia-romagna": "emiliaromagna",
  friuli: "friuliveneziagiulia",
  friuliveneziagiulia: "friuliveneziagiulia",
  "friuli-venezia-giulia": "friuliveneziagiulia",
  lombardy: "lombardia",
  latium: "lazio",
  tuscany: "toscana",
  piedmont: "piemonte",
  apulia: "puglia",
  sicily: "sicilia",
  sardinia: "sardegna",
  veneto: "veneto",
  marche: "marche",
  "themarche": "marche",
  trentino: "trentinoaltoadige",
  trentinoaltoadige: "trentinoaltoadige",
  valledaosta: "valledaosta",
  "valle-d-aosta": "valledaosta",
  aostavalley: "valledaosta"
};

Object.assign(LOCATION_ALIASES, {
  milan: "MI",
  rome: "RM",
  florence: "FI",
  venice: "VE",
  naples: "NA",
  turin: "TO",
  lakecomo: "CO",
  lagodicomo: "CO",
  comolake: "CO",
  monza: "MB",
  rimini: "RN",
  salento: "LE",
  chianti: "SI",
  gardalake: "VR",
  lagodigarda: "VR",
  garda: "VR",
  costaazzurraitaliana: "IM"
});

export function normalizeGeoText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function isValidGeoPoint(point: Partial<GeoPoint> | null | undefined): point is GeoPoint {
  return (
    typeof point?.lat === "number" &&
    typeof point?.lng === "number" &&
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng) &&
    point.lat >= -90 &&
    point.lat <= 90 &&
    point.lng >= -180 &&
    point.lng <= 180
  );
}

export function distanceKm(from: GeoPoint, to: GeoPoint) {
  const radiusKm = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findItalianLocationCoordinates(location: string | null | undefined): ItalianLocationMatch | null {
  const raw = location ?? "";
  const code = raw.match(/\(([A-Z]{2})\)/)?.[1];
  if (code && PROVINCE_COORDINATES[code]) return PROVINCE_COORDINATES[code];

  const normalized = normalizeGeoText(raw.split("(")[0] ?? raw);
  if (!normalized) return null;

  const aliasCode = Object.keys(LOCATION_ALIASES)
    .sort((a, b) => b.length - a.length)
    .find((alias) => normalized.includes(alias));
  return aliasCode ? PROVINCE_COORDINATES[LOCATION_ALIASES[aliasCode]] ?? null : null;
}

function normalizedGeoWords(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function containsGeoAlias(value: string, alias: string) {
  const compact = normalizeGeoText(value);
  const words = normalizedGeoWords(value);

  if (!alias) return false;
  if (alias.length <= 4) return words.includes(alias);
  return compact.includes(alias);
}

export function findItalianAreaLabel(value: string | null | undefined) {
  const raw = value ?? "";
  const normalized = normalizeGeoText(raw);
  if (!normalized) return "";

  const regionAlias = Object.keys(REGION_ALIASES)
    .sort((a, b) => b.length - a.length)
    .find((alias) => containsGeoAlias(raw, alias));
  if (regionAlias) return REGION_ALIASES[regionAlias] ?? regionAlias;

  const provinceAlias = Object.keys(LOCATION_ALIASES)
    .sort((a, b) => b.length - a.length)
    .find((alias) => containsGeoAlias(raw, alias));
  if (!provinceAlias) return "";

  return PROVINCE_COORDINATES[LOCATION_ALIASES[provinceAlias]]?.label ?? "";
}

export function italianLocationMatchesArea(location: string | null | undefined, area: string | null | undefined) {
  const match = findItalianLocationCoordinates(location);
  const normalizedArea = normalizeGeoText(area);
  if (!match || !normalizedArea) return false;

  if (normalizeGeoText(match.code) === normalizedArea || normalizeGeoText(match.label) === normalizedArea) {
    return true;
  }

  const regionKey = REGION_ALIASES[normalizedArea] ?? normalizedArea;
  return REGION_PROVINCE_CODES[regionKey]?.includes(match.code) ?? false;
}

export function nearestItalianProvince(point: GeoPoint): ItalianLocationMatch {
  return Object.values(PROVINCE_COORDINATES)
    .map((province) => ({ province, distance: distanceKm(point, province.point) }))
    .sort((a, b) => a.distance - b.distance)[0].province;
}

export function italianProvinceLabels() {
  return Object.values(PROVINCE_COORDINATES)
    .map((province) => province.label)
    .sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }));
}

export function localizedDistanceLabel(distance: number, locale: "it" | "en" | "es" | "fr") {
  const rounded = distance < 35 ? Math.max(1, Math.round(distance)) : Math.round(distance / 5) * 5;
  if (locale === "en") return `About ${rounded} km from you`;
  if (locale === "es") return `A unos ${rounded} km de ti`;
  if (locale === "fr") return `A environ ${rounded} km de vous`;
  return `A circa ${rounded} km da te`;
}
