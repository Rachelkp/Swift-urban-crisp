import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PromoStage } from "@/components/promo-stage";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { clip, suggestHeadline, type Aspect } from "@/lib/promo";
import { resolveXLink, type ResolvedPost } from "@/lib/resolve-x";

type WatchSearch = {
  u: string;
  h: string;
  s: string;
  b: string;
  c: string;
  a: Aspect;
  l: boolean;
};

function textOf(value: unknown, max: number) {
  return typeof value === "string" ? clip(value, max) : "";
}

export const Route = createFileRoute("/watch")({
  validateSearch: (search: Record<string, unknown>): WatchSearch => {
    const aspect: Aspect =
      search.a === "story" || search.a === "square" || search.a === "wide" ? search.a : "wide";
    const loop = typeof search.l === "boolean" ? search.l : search.l !== "0";
    return {
      u: textOf(search.u, 500),
      h: textOf(search.h, 80),
      s: textOf(search.s, 140),
      b: textOf(search.b, 24),
      c: textOf(search.c, 32),
      a: aspect,
      l: loop,
    };
  },
  component: WatchPage,
});

function WatchPage() {
  const search = Route.useSearch();
  const [post, setPost] = useState<ResolvedPost | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!search.u) return;
    let cancel = false;
    setBusy(true);
    setError("");
    void resolveXLink({ data: { url: search.u } })
      .then((result) => {
        if (cancel) return;
        if (!result.ok) {
          setPost(null);
          setError(result.message);
          return;
        }
        setPost(result.post);
      })
      .catch(() => {
        if (!cancel) setError("เปิดโปรโมทนี้ไม่สำเร็จ");
      })
      .finally(() => {
        if (!cancel) setBusy(false);
      });
    return () => {
      cancel = true;
    };
  }, [search.u]);

  const headline = search.h || (post ? suggestHeadline(post.text, post.handle) : "");
  const subline = search.s || (post ? `@${post.handle}` : "");
  const cta = search.c || "ดูบน X";

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col px-4 pt-6 pb-16">
        {!search.u ? (
          <div className="py-16 text-center">
            <h1 className="text-3xl">ยังไม่มีลิงก์โปรโมท</h1>
            <p className="mt-3 text-muted">กลับไปวางลิงก์จาก X เพื่อสร้างหน้านี้</p>
            <Button asChild className="mt-6">
              <Link to="/">ไปที่สตูดิโอ</Link>
            </Button>
          </div>
        ) : null}

        {search.u && busy && !post ? <p className="py-16 text-center text-muted">กำลังเปิดโปรโมท…</p> : null}
        {error ? <p className="py-10 text-center">{error}</p> : null}

        {post ? (
          <>
            <PromoStage
              kind={post.kind}
              videoUrl={post.videoUrl}
              poster={post.poster}
              photos={post.photos}
              headline={headline}
              subline={subline}
              badge={search.b}
              aspect={search.a}
              loop={search.l}
              autoPlay
              durationHint={post.duration}
            />
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="sm:flex-1">
                <a href={post.url} target="_blank" rel="noreferrer">
                  {cta}
                </a>
              </Button>
              <Button asChild variant="line" className="sm:flex-1">
                <Link to="/" search={{ u: post.url }}>
                  แต่งโปรโมทนี้ต่อ
                </Link>
              </Button>
            </div>
            {post.text ? <p className="mt-5 text-sm leading-relaxed text-muted">{post.text}</p> : null}
          </>
        ) : null}
      </main>
    </div>
  );
}
