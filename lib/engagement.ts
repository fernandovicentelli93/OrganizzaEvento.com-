function todayKey() {
  const parts = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";
  return `${year}-${month}-${day}`;
}

function stableHash(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function ageInHours(createdAt?: Date | string | null) {
  if (!createdAt) return 72;
  const timestamp = createdAt instanceof Date ? createdAt.getTime() : new Date(createdAt).getTime();
  if (!Number.isFinite(timestamp)) return 72;
  return Math.max(0, (Date.now() - timestamp) / (1000 * 60 * 60));
}

export function dailyConversationViews(seed: string, createdAt?: Date | string | null) {
  const input = `${seed}:${todayKey()}`;
  const hash = stableHash(input);
  const ageHours = ageInHours(createdAt);
  const maxViews = 15 + (hash % 6);

  if (ageHours < 2) return 0;

  const rampHours = 24 + (stableHash(`${seed}:ramp`) % 25);
  const progress = Math.min(1, (ageHours - 2) / rampHours);
  const dailyMovement = stableHash(`${input}:movement`) % 3;

  return Math.min(maxViews, Math.max(0, Math.floor(progress * maxViews) + dailyMovement));
}

function stableNumber(seed: string, min: number, max: number, salt: string) {
  const input = `${seed}:${salt}`;
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33 + input.charCodeAt(index)) >>> 0;
  }

  return min + (hash % (max - min + 1));
}

export function conversationFollowers(seed: string) {
  return stableNumber(seed, 2, 18, "followers");
}

export function answerHelpfulnessSignal(seed: string) {
  return stableNumber(seed, 61, 94, "helpfulness");
}
