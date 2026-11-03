function hostOf(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function safeImage(url: string | null | undefined): string | null {
  if (!url) return null;
  return hostOf(url) === "pbs.twimg.com" ? url : null;
}

export function safeVideo(url: string | null | undefined): string | null {
  if (!url) return null;
  return hostOf(url) === "video.twimg.com" ? url : null;
}
