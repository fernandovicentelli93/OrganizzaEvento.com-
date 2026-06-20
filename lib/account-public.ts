import type { AccountRole } from "@prisma/client";

export type PublicAccountTagSource = {
  role?: AccountRole | null;
  profileTag?: string | null;
  supplierCategory?: string | null;
  businessName?: string | null;
} | null | undefined;

export const clientProfileTags = [
  "Cliente",
  "Sposo/a",
  "Organizzatore privato",
  "Azienda",
  "HR / Marketing",
  "Assistente personale",
  "Altro"
];

export const supplierProfileTags = [
  "Event planner",
  "Wedding planner",
  "Proprietario location",
  "Catering",
  "DJ / Musica",
  "Fotografo / Videomaker",
  "Fiorista / Allestimenti",
  "Open bar",
  "Animazione",
  "Audio / Luci",
  "Noleggi e arredi",
  "Altro fornitore"
];

export const localizedProfileTagOptions: Record<"it" | "en" | "es" | "fr", { client: string[]; supplier: string[] }> = {
  it: {
    client: clientProfileTags,
    supplier: supplierProfileTags
  },
  en: {
    client: ["Client", "Bride / groom", "Private organizer", "Company", "HR / Marketing", "Personal assistant", "Other"],
    supplier: ["Event planner", "Wedding planner", "Venue owner", "Catering", "DJ / Music", "Photographer / Videographer", "Florist / Styling", "Open bar", "Entertainment", "Audio / Lighting", "Rentals and furniture", "Other supplier"]
  },
  es: {
    client: ["Cliente", "Novia / novio", "Organizador privado", "Empresa", "RRHH / Marketing", "Asistente personal", "Otro"],
    supplier: ["Event planner", "Wedding planner", "Propietario de location", "Catering", "DJ / Musica", "Fotografo / Videografo", "Florista / Decoracion", "Open bar", "Animacion", "Audio / Luces", "Alquileres y mobiliario", "Otro proveedor"]
  },
  fr: {
    client: ["Client", "Mariee / marie", "Organisateur prive", "Entreprise", "RH / Marketing", "Assistant personnel", "Autre"],
    supplier: ["Event planner", "Wedding planner", "Propriétaire de lieu", "Traiteur", "DJ / Musique", "Photographe / Vidéaste", "Fleuriste / Décoration", "Open bar", "Animation", "Audio / Lumières", "Locations et mobilier", "Autre prestataire"]
  }
};

export function normalizePublicIdentity(value?: string | null) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function accountPublicTag(account: PublicAccountTagSource) {
  if (!account) return null;
  if (account.profileTag?.trim()) return account.profileTag.trim();
  if (account.role === "supplier" && account.supplierCategory?.trim()) return account.supplierCategory.trim();
  if (account.role === "supplier") return "Fornitore";
  if (account.role === "client") return "Cliente";
  return null;
}
