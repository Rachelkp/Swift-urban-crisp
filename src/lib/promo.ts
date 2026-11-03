export type Aspect = "wide" | "story" | "square";

export type Draft = {
  headline: string;
  subline: string;
  badge: string;
  cta: string;
  aspect: Aspect;
  loop: boolean;
};

export type Campaign = Draft & {
  id: string;
  sourceUrl: string;
  savedAt: number;
  handle: string;
  authorName: string;
  poster: string | null;
  kind: "video" | "photo" | "text";
};

const KEY = "seenlink.shelf.v1";

export function clip(value: string, max: number) {
  return Array.from(value).slice(0, max).join("");
}

export function suggestHeadline(text: string, handle: string) {
  const line = text.replace(/\s+/g, " ").trim();
  if (Array.from(line).length >= 2) return clip(line, 72);
  return `คลิปใหม่จาก @${handle}`;
}

export function suggestAspect(width: number | null, height: number | null): Aspect {
  if (width && height && height > width * 1.05) return "story";
  if (width && height && Math.abs(width - height) < 40) return "square";
  return "wide";
}

function isAspect(value: unknown): value is Aspect {
  return value === "wide" || value === "story" || value === "square";
}

function isCampaign(value: unknown): value is Campaign {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<Campaign>;
  return (
    typeof row.id === "string" &&
    typeof row.sourceUrl === "string" &&
    typeof row.headline === "string" &&
    typeof row.subline === "string" &&
    typeof row.badge === "string" &&
    typeof row.cta === "string" &&
    isAspect(row.aspect) &&
    typeof row.loop === "boolean" &&
    typeof row.savedAt === "number" &&
    typeof row.handle === "string" &&
    typeof row.authorName === "string" &&
    (row.poster === null || typeof row.poster === "string") &&
    (row.kind === "video" || row.kind === "photo" || row.kind === "text")
  );
}

export function loadShelf(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCampaign).slice(0, 12);
  } catch {
    return [];
  }
}

export function saveShelf(campaigns: Campaign[]) {
  localStorage.setItem(KEY, JSON.stringify(campaigns.slice(0, 12)));
}
