import type { DisplayMode } from "@prisma/client";

export function publicName(displayMode: DisplayMode, displayName?: string | null) {
  if (displayMode === "anonymous") return "Anonimo";
  if (displayName?.trim()) return displayName.trim();
  return displayMode === "nickname" ? "Nickname" : "Nome reale";
}

export function displayModeLabel(displayMode: DisplayMode) {
  if (displayMode === "anonymous") return "Anonimo";
  if (displayMode === "nickname") return "Nickname";
  return "Nome reale";
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function formatEventDate(date?: Date | string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

export function compactLocation(city?: string | null, region?: string | null) {
  return [city, region].filter(Boolean).join(", ");
}

export function excerpt(text: string, length = 170) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trim()}...`;
}
