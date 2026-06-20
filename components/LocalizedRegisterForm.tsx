"use client";

import { useState } from "react";
import { GoogleIcon } from "@/components/GoogleIcon";
import { localizedProfileTagOptions } from "@/lib/account-public";
import { localizedStaticPath, type Locale } from "@/lib/i18n-basic";

type TranslationLocale = Exclude<Locale, "it">;

const supplierCategoryOptions: Record<TranslationLocale, string[]> = {
  en: [
    "Venue",
    "Catering and banqueting",
    "Wedding planner / event planner",
    "Music, DJ and entertainment",
    "Photo and video",
    "Flowers and styling",
    "Open bar and beverages",
    "Children entertainment",
    "Audio, lighting and technical service",
    "Rentals and furniture",
    "Graphic design and invitations",
    "Other event service"
  ],
  es: [
    "Location",
    "Catering y banqueting",
    "Wedding planner / event planner",
    "Musica, DJ y entretenimiento",
    "Foto y video",
    "Flores y decoración",
    "Open bar y bebidas",
    "Animacion infantil",
    "Audio, luces y técnica",
    "Alquileres y mobiliario",
    "Grafica e invitaciones",
    "Otro servicio de eventos"
  ],
  fr: [
    "Lieu",
    "Traiteur et banqueting",
    "Wedding planner / event planner",
    "Musique, DJ et animation",
    "Photo et video",
    "Fleurs et décoration",
    "Open bar et boissons",
    "Animation enfants",
    "Audio, lumières et technique",
    "Locations et mobilier",
    "Graphisme et invitations",
    "Autre service événementiel"
  ]
};

const eventTypeOptions: Record<TranslationLocale, string[]> = {
  en: ["Weddings", "Birthdays", "18th birthdays", "Graduations", "Private parties", "Private dinners", "Corporate events", "Team building", "Anniversaries", "Other"],
  es: ["Bodas", "Cumpleaños", "Fiestas de 18", "Graduaciones", "Fiestas privadas", "Cenas privadas", "Eventos corporativos", "Team building", "Aniversarios", "Otro"],
  fr: ["Mariages", "Anniversaires", "18 ans", "Remises de diplôme", "Fêtes privées", "Dîners privés", "Événements d'entreprise", "Team building", "Anniversaires de couple", "Autre"]
};

const copy: Record<
  TranslationLocale,
  {
    client: string;
    supplier: string;
    displayName: string;
    displayHint: string;
    profileTag: string;
    profileHint: string;
    email: string;
    password: string;
    businessName: string;
    category: string;
    services: string;
    eventTypes: string;
    city: string;
    region: string;
    areas: string;
    privacy: string;
    submit: string;
    choose: string;
    supplierTitle: string;
    googleClient: string;
    googleSupplier: string;
    googleHint: string;
  }
> = {
  en: {
    client: "Client",
    supplier: "Supplier",
    displayName: "Public name",
    displayHint: "It cannot match an already registered client or supplier name.",
    profileTag: "What do you do in the community?",
    profileHint: "This tag appears next to your name when you write.",
    email: "Private email",
    password: "Password",
    businessName: "Business or studio name",
    category: "Main category",
    services: "Services offered",
    eventTypes: "Event types served",
    city: "Base city",
    region: "Region",
    areas: "Areas covered",
    privacy: "I accept privacy and community rules. The public profile must not include phone numbers, emails or direct contact details.",
    submit: "Create account",
    choose: "Choose",
    supplierTitle: "Supplier mapping",
    googleClient: "Continue with Google as client",
    googleSupplier: "Continue with Google as supplier",
    googleHint: "If the account does not exist, we create it with the selected role.",
  },
  es: {
    client: "Cliente",
    supplier: "Proveedor",
    displayName: "Nombre publico",
    displayHint: "No puede coincidir con un cliente o proveedor ya registrado.",
    profileTag: "Que haces en la comunidad?",
    profileHint: "Esta etiqueta aparece junto a tu nombre cuando escribes.",
    email: "Email privado",
    password: "Password",
    businessName: "Nombre de empresa o estudio",
    category: "Categoría principal",
    services: "Servicios ofrecidos",
    eventTypes: "Tipos de evento",
    city: "Ciudad base",
    region: "Region",
    areas: "Zonas cubiertas",
    privacy: "Acepto privacidad y reglas. El perfil publico no debe incluir teléfonos, emails o contactos directos.",
    submit: "Crear cuenta",
    choose: "Elige",
    supplierTitle: "Mapeo proveedor",
    googleClient: "Continuar con Google como cliente",
    googleSupplier: "Continuar con Google como proveedor",
    googleHint: "Si la cuenta no existe, la creamos con el rol seleccionado.",
  },
  fr: {
    client: "Client",
    supplier: "Prestataire",
    displayName: "Nom public",
    displayHint: "Il ne peut pas être identique a un client ou prestataire déjà inscrit.",
    profileTag: "Que faites-vous dans la communauté?",
    profileHint: "Cette etiquette apparait a cote de votre nom quand vous ecrivez.",
    email: "Email prive",
    password: "Mot de passe",
    businessName: "Nom d'entreprise ou studio",
    category: "Catégorie principale",
    services: "Services proposes",
    eventTypes: "Types d'événement",
    city: "Ville de base",
    region: "Region",
    areas: "Zones couvertes",
    privacy: "J'accepte la confidentialité et les règles. Le profil public ne doit pas inclure téléphone, email ou contact direct.",
    submit: "Créer un compte",
    choose: "Choisir",
    supplierTitle: "Profil prestataire",
    googleClient: "Continuer avec Google comme client",
    googleSupplier: "Continuer avec Google comme prestataire",
    googleHint: "Si le compte n'existe pas, nous le creons avec le role choisi.",
  }
};

export function LocalizedRegisterForm({ locale, startedAt }: { locale: TranslationLocale; startedAt: number }) {
  const [role, setRole] = useState<"client" | "supplier">("client");
  const c = copy[locale];
  const profileTags = localizedProfileTagOptions[locale][role];

  return (
    <form action="/api/account/register" method="post" className="grid gap-4">
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="signupPath" value={localizedStaticPath(locale, "signup")} />
      <input type="hidden" name="formStartedAt" value={startedAt} />
      <label className="sr-only">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {(["client", "supplier"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRole(item)}
            className={`focus-ring rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
              role === item ? "border-violet-cta bg-petal text-ink" : "border-line bg-white text-muted hover:bg-cream"
            }`}
          >
            {item === "supplier" ? c.supplier : c.client}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-cream p-3 text-center">
        <a
          href={`/api/auth/google/start?mode=signup&role=${role}&locale=${locale}&returnTo=${encodeURIComponent(localizedStaticPath(locale, "signup"))}`}
          className="focus-ring flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
        >
          <GoogleIcon />
          {role === "supplier" ? c.googleSupplier : c.googleClient}
        </a>
        <p className="mt-2 text-xs leading-5 text-muted">{c.googleHint}</p>
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        <span className="h-px flex-1 bg-line" />
        email
        <span className="h-px flex-1 bg-line" />
      </div>

      <label>
        <span className="text-sm font-semibold text-ink">{c.displayName}</span>
        <input name="displayName" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
        <span className="mt-1 block text-xs leading-5 text-muted">{c.displayHint}</span>
      </label>

      <label>
        <span className="text-sm font-semibold text-ink">{c.profileTag}</span>
        <select name="profileTag" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink">
          <option value="">{c.choose}</option>
          {profileTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs leading-5 text-muted">{c.profileHint}</span>
      </label>

      <label>
        <span className="text-sm font-semibold text-ink">{c.email}</span>
        <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
      </label>
      <label>
        <span className="text-sm font-semibold text-ink">{c.password}</span>
        <input name="password" type="password" minLength={8} required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
      </label>

      {role === "supplier" ? (
        <section className="rounded-xl border border-[#E8C7D2] bg-petal/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{c.supplierTitle}</p>
          <div className="mt-4 grid gap-4">
            <label>
              <span className="text-sm font-semibold text-ink">{c.businessName}</span>
              <input name="businessName" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">{c.category}</span>
              <select name="supplierCategory" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink">
                <option value="">{c.choose}</option>
                {supplierCategoryOptions[locale].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">{c.services}</span>
              <textarea name="supplierServices" required rows={4} className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
            </label>
            <fieldset>
              <legend className="text-sm font-semibold text-ink">{c.eventTypes}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {eventTypeOptions[locale].map((eventType) => (
                  <label key={eventType} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm text-muted">
                    <input name="eventTypesServed" type="checkbox" value={eventType} className="h-4 w-4 accent-[#C9567B]" />
                    <span>{eventType}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-3 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-ink">{c.city}</span>
                <input name="city" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
              </label>
              <label>
                <span className="text-sm font-semibold text-ink">{c.region}</span>
                <input name="region" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
              </label>
            </div>
            <label>
              <span className="text-sm font-semibold text-ink">{c.areas}</span>
              <input name="serviceAreas" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
            </label>
          </div>
        </section>
      ) : null}

      <label className="flex gap-3 rounded-xl border border-line bg-petal px-4 py-3 text-sm leading-6 text-muted">
        <input name="privacyAccepted" type="checkbox" value="yes" required className="mt-1 h-4 w-4 shrink-0 accent-[#C9567B]" />
        <span>{c.privacy}</span>
      </label>
      <button className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
        {c.submit}
      </button>
    </form>
  );
}
