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

export function dailyConversationViews(seed: string) {
  const input = `${seed}:${todayKey()}`;
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return 3 + (hash % 32);
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
