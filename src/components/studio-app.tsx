import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Check, Copy, ExternalLink, Loader2, Play, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { PromoStage } from "@/components/promo-stage";
import { Button } from "@/components/ui/button";
import { safeImage } from "@/lib/media-url";
import {
  clip,
  loadShelf,
  saveShelf,
  suggestAspect,
  suggestHeadline,
  type Aspect,
  type Campaign,
  type Draft,
} from "@/lib/promo";
import { resolveXLink, type ResolvedPost } from "@/lib/resolve-x";

const SAMPLE = "https://x.com/NASASpaceflight/status/2107823511930593687";
const SAMPLE_POSTER =
  "https://pbs.twimg.com/amplify_video_thumb/2107823426903621632/img/nrjSsE2frt_m2Upj.jpg";

const BADGES = ["ใหม่", "ไวรัล", "เบื้องหลัง", "รอบปฐมทัศน์"];
const ASPECTS: { id: Aspect; label: string }[] = [
  { id: "wide", label: "กว้าง" },
  { id: "story", label: "สตอรี่" },
  { id: "square", label: "จัตุรัส" },
];

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-line bg-bg px-4 text-base text-fg outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function compact(value: number) {
  return new Intl.NumberFormat("th-TH", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

const STEPS = [
  { n: "1", title: "วางลิงก์โพสต์", body: "ใช้ลิงก์จาก x.com หรือ twitter.com ที่เป็นโพสต์สาธารณะ" },
  { n: "2", title: "แต่งคำโปรโมท", body: "ใส่หัวข้อ ป้าย และปุ่ม ให้คลิปพร้อมส่งต่อ" },
  { n: "3", title: "แชร์หน้าเดียว", body: "เปิดหน้าโปรโมทที่เล่นวิดีโอได้โดยไม่ต้องฝังทวีต" },
];

export function StudioApp({ initialUrl }: { initialUrl: string }) {
  const navigate = useNavigate();
  const router = useRouter();
  const [input, setInput] = useState(initialUrl);
  const [post, setPost] = useState<ResolvedPost | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [headline, setHeadline] = useState("");
  const [subline, setSubline] = useState("");
  const [badge, setBadge] = useState("");
  const [cta, setCta] = useState("ดูบน X");
  const [aspect, setAspect] = useState<Aspect>("wide");
  const [loop, setLoop] = useState(true);
  const [shelf, setShelf] = useState<Campaign[]>([]);
  const [shelfReady, setShelfReady] = useState(false);
  const [posterOk, setPosterOk] = useState(true);

  useEffect(() => {
    setShelf(loadShelf());
    setShelfReady(true);
  }, []);

  useEffect(() => {
    if (!shelfReady) return;
    saveShelf(shelf);
  }, [shelf, shelfReady]);

  useEffect(() => {
    if (!initialUrl) return;
    let cancel = false;
    setInput(initialUrl);
    void load(initialUrl, undefined, () => cancel);
    return () => {
      cancel = true;
    };
    // load is stable enough for this url-driven fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  async function load(url: string, preset?: Draft, isCancelled?: () => boolean) {
    setBusy(true);
    setError("");
    setNote("");
    setFallbackUrl("");
    try {
      const result = await resolveXLink({ data: { url } });
      if (isCancelled?.()) return;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      const next = result.post;
      setPost(next);
      setHeadline(preset?.headline ?? suggestHeadline(next.text, next.handle));
      setSubline(preset?.subline ?? `@${next.handle}`);
      setBadge(preset?.badge ?? "");
      setCta(preset?.cta || "ดูบน X");
      setAspect(preset?.aspect ?? suggestAspect(next.width, next.height));
      setLoop(preset?.loop ?? true);
    } catch {
      if (!isCancelled?.()) setError("ดึงโพสต์ไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      if (!isCancelled?.()) setBusy(false);
    }
  }

  function go(url: string) {
    const next = url.trim();
    if (!next) {
      setError("วางลิงก์โพสต์ก่อน");
      return;
    }
    if (next === initialUrl) {
      void load(next);
      return;
    }
    void navigate({ to: "/", search: { u: next } });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    go(input);
  }

  function watchSearch() {
    return {
      u: post?.url ?? "",
      h: clip(headline, 80),
      s: clip(subline, 140),
      b: clip(badge, 24),
      c: clip(cta, 32),
      a: aspect,
      l: loop,
    };
  }

  async function copyLink() {
    if (!post) return;
    const href = router.buildLocation({ to: "/watch", search: watchSearch() }).href;
    const absolute = new URL(href, window.location.href).toString();
    try {
      await navigator.clipboard.writeText(absolute);
      setFallbackUrl("");
      setNote("คัดลอกลิงก์โปรโมทแล้ว");
    } catch {
      setFallbackUrl(absolute);
      setNote("คัดลอกอัตโนมัติไม่ได้ ลากเลือกลิงก์ด้านล่าง");
    }
  }

  function keep() {
    if (!post) return;
    const campaign: Campaign = {
      id: crypto.randomUUID(),
      sourceUrl: post.url,
      headline: clip(headline, 80),
      subline: clip(subline, 140),
      badge: clip(badge, 24),
      cta: clip(cta, 32) || "ดูบน X",
      aspect,
      loop,
      savedAt: Date.now(),
      handle: post.handle,
      authorName: post.authorName,
      poster: post.poster,
      kind: post.kind,
    };
    setShelf((list) => [campaign, ...list.filter((item) => item.sourceUrl !== post.url)].slice(0, 12));
    setNote("เก็บไว้บนชั้นวางของเบราว์เซอร์นี้แล้ว");
  }

  const when = post ? formatWhen(post.createdAt) : "";

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-16">
      <section>
        <p className="text-sm font-medium text-accent">สตูดิโอโปรโมทคลิป</p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl">
          {post ? "เฟรมนี้พร้อมแชร์" : "วางลิงก์จาก X แล้วได้หน้าโปรโมท"}
        </h1>
        {!post ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            ดึงวิดีโอจากโพสต์บน X หรือ Twitter มาใส่หัวข้อ ป้าย และปุ่ม แล้วเปิดเป็นหน้าโปรโมทที่เล่นคลิปได้เลย
            ไม่ต้องฝังกล่องทวีต
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 rounded-3xl border border-line bg-surface p-3 sm:p-4">
          <label htmlFor="x-link" className="px-2 text-sm font-medium">
            ลิงก์โพสต์
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="x-link"
              name="url"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="https://x.com/ชื่อ/status/…"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="url"
              className={fieldClass}
            />
            <Button type="submit" disabled={busy} className="sm:min-w-32">
              {busy ? <Loader2 className="size-4 motion-safe:animate-spin" /> : null}
              ดึงคลิป
            </Button>
          </div>
          <p className="px-2 pt-3 text-sm text-muted">ใช้ได้กับโพสต์สาธารณะบน x.com และ twitter.com</p>
        </form>

        <div aria-live="polite" className="mt-3 min-h-6 text-sm">
          {busy ? <p className="text-muted">กำลังดึงคลิปจาก X…</p> : null}
          {error ? <p className="text-fg">{error}</p> : null}
          {!busy && note ? <p className="text-accent">{note}</p> : null}
        </div>
      </section>

      {!post ? (
        <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-2">
          <ol className="grid gap-3">
            {STEPS.map((step) => (
              <li key={step.n} className="rounded-3xl border border-line bg-surface p-4">
                <p className="text-sm font-medium text-accent">{step.n}</p>
                <h2 className="mt-1 text-xl">{step.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => go(SAMPLE)}
            className="group relative min-h-56 overflow-hidden rounded-3xl bg-raised text-left"
            aria-label="ลองคลิปตัวอย่างจาก X"
          >
            {posterOk ? (
              <img
                src={SAMPLE_POSTER}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setPosterOk(false)}
              />
            ) : null}
            <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-accent text-ink">
                <Play className="size-7 translate-x-0.5" aria-hidden="true" />
              </span>
            </span>
            <span className="absolute right-5 bottom-5 left-5">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-ink">ตัวอย่าง</span>
              <span className="mt-3 block text-2xl text-fg">คลิปจากโพสต์บน X</span>
              <span className="mt-1 block text-sm text-muted">แตะเพื่อดึงวิดีโอตัวอย่างเข้าสตูดิโอ</span>
            </span>
          </button>
        </div>
      ) : null}

      {post ? (
        <div className={busy ? "mt-6 grid gap-6 opacity-70 lg:grid-cols-2" : "mt-6 grid gap-6 lg:grid-cols-2"}>
          <div>
            <PromoStage
              kind={post.kind}
              videoUrl={post.videoUrl}
              poster={post.poster}
              photos={post.photos}
              headline={headline || suggestHeadline(post.text, post.handle)}
              subline={subline}
              badge={badge}
              aspect={aspect}
              loop={loop}
              durationHint={post.duration}
            />
            <div className="mt-4 flex items-center gap-3">
              {post.avatar ? (
                <img
                  src={post.avatar}
                  alt=""
                  className="size-11 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="grid size-11 place-items-center rounded-full bg-raised text-sm text-accent">
                  {Array.from(post.authorName)[0]}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">{post.authorName}</p>
                <p className="truncate text-sm text-muted">
                  @{post.handle}
                  {when ? ` · ${when}` : ""}
                </p>
              </div>
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted tabular-nums">
              {post.views != null ? (
                <div>
                  <dt className="inline">วิว </dt>
                  <dd className="inline text-fg">{compact(post.views)}</dd>
                </div>
              ) : null}
              <div>
                <dt className="inline">ถูกใจ </dt>
                <dd className="inline text-fg">{compact(post.likes)}</dd>
              </div>
              <div>
                <dt className="inline">รีโพสต์ </dt>
                <dd className="inline text-fg">{compact(post.reposts)}</dd>
              </div>
            </dl>
            {post.kind === "photo" ? (
              <p className="mt-3 text-sm text-muted">โพสต์นี้ไม่มีวิดีโอ ใช้ภาพเป็นโปสเตอร์โปรโมท</p>
            ) : null}
            {post.kind === "text" ? (
              <p className="mt-3 text-sm text-muted">โพสต์นี้ไม่มีวิดีโอหรือภาพ จัดเป็นการ์ดข้อความ</p>
            ) : null}
            {post.text ? (
              <blockquote className="mt-4 border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted">
                {post.text}
              </blockquote>
            ) : null}
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-accent"
            >
              เปิดโพสต์ต้นฉบับ
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>

          <form
            className="grid content-start gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <h2 className="text-xl">แต่งโปรโมท</h2>
            <label className="grid gap-2 text-sm font-medium">
              หัวข้อ
              <input
                value={headline}
                onChange={(event) => setHeadline(clip(event.target.value, 80))}
                className={fieldClass}
                maxLength={80}
              />
            </label>
            {post.text ? (
              <button
                type="button"
                className="w-fit text-sm text-accent"
                onClick={() => setHeadline(suggestHeadline(post.text, post.handle))}
              >
                ใช้ข้อความจากโพสต์
              </button>
            ) : null}
            <label className="grid gap-2 text-sm font-medium">
              บรรทัดรอง
              <input
                value={subline}
                onChange={(event) => setSubline(clip(event.target.value, 140))}
                className={fieldClass}
                maxLength={140}
              />
            </label>
            <div>
              <p className="text-sm font-medium">ป้ายเล็ก</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {BADGES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={badge === item}
                    onClick={() => setBadge((current) => (current === item ? "" : item))}
                    className={
                      badge === item
                        ? "min-h-11 rounded-full bg-accent px-4 text-sm font-medium text-ink"
                        : "min-h-11 rounded-full bg-raised px-4 text-sm text-fg"
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              ข้อความปุ่ม
              <input
                value={cta}
                onChange={(event) => setCta(clip(event.target.value, 32))}
                className={fieldClass}
                maxLength={32}
              />
            </label>
            <div>
              <p className="text-sm font-medium" id="aspect-label">
                สัดส่วนเฟรม
              </p>
              <div role="radiogroup" aria-labelledby="aspect-label" className="mt-2 grid grid-cols-3 gap-2">
                {ASPECTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={aspect === item.id}
                    onClick={() => setAspect(item.id)}
                    className={
                      aspect === item.id
                        ? "min-h-11 rounded-full bg-accent text-sm font-medium text-ink"
                        : "min-h-11 rounded-full bg-raised text-sm text-fg"
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-pressed={loop}
              onClick={() => setLoop((value) => !value)}
              className="flex min-h-11 items-center justify-between rounded-2xl bg-raised px-4 text-sm"
            >
              วนลูปคลิป
              <span className={loop ? "text-accent" : "text-muted"}>{loop ? "เปิด" : "ปิด"}</span>
            </button>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="button" onClick={keep}>
                <Check className="size-4" aria-hidden="true" />
                เก็บบนชั้นวาง
              </Button>
              <Button type="button" variant="quiet" onClick={() => void copyLink()}>
                <Copy className="size-4" aria-hidden="true" />
                คัดลอกลิงก์
              </Button>
              <Button asChild variant="line" className="sm:col-span-2">
                <Link to="/watch" search={watchSearch()}>
                  เปิดหน้าโปรโมท
                </Link>
              </Button>
            </div>
            {fallbackUrl ? (
              <input readOnly value={fallbackUrl} className={fieldClass} onFocus={(event) => event.target.select()} />
            ) : null}
          </form>
        </div>
      ) : null}

      <section className="mt-12">
        <h2 className="text-2xl">ชั้นวางของฉัน</h2>
        <p className="mt-1 text-sm text-muted">เก็บไว้ในเบราว์เซอร์นี้เท่านั้น ไม่ต้องสมัครบัญชี</p>
        {shelf.length === 0 ? (
          <p className="mt-4 rounded-3xl border border-line bg-surface px-4 py-8 text-sm text-muted">
            ยังไม่มีโปรโมทที่เก็บไว้ ดึงคลิปแล้วกดเก็บบนชั้นวาง
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shelf.map((item) => {
              const poster = safeImage(item.poster);
              return (
                <li key={item.id} className="overflow-hidden rounded-3xl border border-line bg-surface">
                  <button type="button" onClick={() => void load(item.sourceUrl, item)} className="block w-full text-left">
                    {poster ? (
                      <img src={poster} alt="" className="aspect-video w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="grid aspect-video w-full place-items-center bg-raised text-sm text-muted">
                        {item.kind === "text" ? "การ์ดข้อความ" : "ไม่มีภาพปก"}
                      </span>
                    )}
                    <span className="block px-4 pt-3 text-base font-medium">{item.headline}</span>
                    <span className="block px-4 pb-3 text-sm text-muted">@{item.handle}</span>
                  </button>
                  <div className="px-3 pb-3">
                    <button
                      type="button"
                      onClick={() => setShelf((list) => list.filter((row) => row.id !== item.id))}
                      className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-muted"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      ลบ
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="mt-12 text-sm leading-relaxed text-muted">
        ซีนลิงก์อ่านโพสต์สาธารณะเพื่อจัดหน้าโปรโมท ไฟล์วิดีโอยังอยู่ที่ต้นทางบน X
      </footer>
    </main>
  );
}
