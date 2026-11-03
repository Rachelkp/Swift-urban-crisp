import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { safeImage, safeVideo } from "@/lib/media-url";
import type { Aspect } from "@/lib/promo";

type Props = {
  kind: "video" | "photo" | "text";
  videoUrl: string | null;
  poster: string | null;
  photos: string[];
  headline: string;
  subline: string;
  badge: string;
  aspect: Aspect;
  loop: boolean;
  autoPlay?: boolean;
  durationHint?: number | null;
};

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remain = total % 60;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

export function PromoStage({
  kind,
  videoUrl,
  poster,
  photos,
  headline,
  subline,
  badge,
  aspect,
  loop,
  autoPlay = false,
  durationHint = null,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(durationHint ?? 0);
  const [failed, setFailed] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const playable = safeVideo(videoUrl);
  const still = safeImage(poster);
  const gallery = photos.map((photo) => safeImage(photo)).filter((photo): photo is string => photo !== null);

  useEffect(() => {
    setPlaying(false);
    setFailed(false);
    setTime(0);
    setDuration(durationHint ?? 0);
    setPhotoIndex(0);
  }, [playable, durationHint, gallery.length]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !autoPlay || !playable) return;
    el.muted = true;
    void el.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, [autoPlay, playable]);

  function toggle() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(
        () => setPlaying(true),
        () => setFailed(true),
      );
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function seek(event: MouseEvent<HTMLButtonElement>) {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
  }

  function nudge(event: KeyboardEvent<HTMLButtonElement>) {
    const el = videoRef.current;
    if (!el) return;
    if (event.key === "ArrowRight") el.currentTime = Math.min(el.duration || 0, el.currentTime + 2);
    if (event.key === "ArrowLeft") el.currentTime = Math.max(0, el.currentTime - 2);
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;
  const frame = cn(
    "relative overflow-hidden rounded-3xl bg-raised",
    aspect === "wide" && "frame-wide",
    aspect === "story" && "frame-story",
    aspect === "square" && "frame-square",
  );

  return (
    <div className={cn("mx-auto w-full", aspect === "story" && "max-w-sm", aspect === "square" && "max-w-md")}>
      <div className={frame}>
        {kind === "video" && playable && !failed ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={playable}
            poster={still ?? undefined}
            playsInline
            loop={loop}
            muted={muted}
            preload="metadata"
            referrerPolicy="no-referrer"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={(event) => {
              const code = event.currentTarget.error?.code ?? 0;
              console.error(`video-error ${code} ${event.currentTarget.currentSrc}`);
              setFailed(true);
            }}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || durationHint || 0)}
            onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          />
        ) : null}

        {kind === "photo" && gallery.length > 0 ? (
          <img
            src={gallery[photoIndex] ?? gallery[0]}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : null}

        {kind !== "photo" && kind !== "video" ? (
          <div className="flex h-full flex-col justify-end bg-surface p-6">
            {badge ? (
              <span className="w-fit rounded-full bg-accent px-3 py-1 text-sm font-medium text-ink">{badge}</span>
            ) : null}
            <p className="mt-3 text-2xl text-fg">{headline}</p>
            {subline ? <p className="mt-2 text-sm text-muted">{subline}</p> : null}
          </div>
        ) : null}

        {(kind === "video" && failed) || (kind === "video" && !playable) ? (
          <img src={still ?? undefined} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : null}

        {kind !== "text" ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent px-5 pt-16 pb-5">
            {badge ? (
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-ink">{badge}</span>
            ) : null}
            <p className="mt-3 text-2xl text-fg">{headline}</p>
            {subline ? <p className="mt-1 text-sm text-muted">{subline}</p> : null}
          </div>
        ) : null}

        {kind === "video" && playable && !failed ? (
          <button
            type="button"
            className="absolute inset-0 z-10 grid place-items-center"
            onClick={toggle}
            aria-label={playing ? "หยุด" : "เล่นวิดีโอ"}
          >
            {!playing ? (
              <span className="grid size-16 place-items-center rounded-full bg-accent text-ink">
                <Play className="size-7 translate-x-0.5" aria-hidden="true" />
              </span>
            ) : null}
          </button>
        ) : null}

        {kind === "photo" && gallery.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="ภาพก่อนหน้า"
              className="absolute top-1/2 left-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg text-fg"
              onClick={() => setPhotoIndex((index) => (index - 1 + gallery.length) % gallery.length)}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="ภาพถัดไป"
              className="absolute top-1/2 right-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg text-fg"
              onClick={() => setPhotoIndex((index) => (index + 1) % gallery.length)}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {kind === "video" && playable && !failed ? (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full bg-raised text-fg"
            onClick={toggle}
            aria-label={playing ? "หยุด" : "เล่น"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            className="relative h-11 flex-1"
            onClick={seek}
            onKeyDown={nudge}
            role="slider"
            aria-label="ตำแหน่งวิดีโอ"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration || 0)}
            aria-valuenow={Math.round(time)}
          >
            <span className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-line">
              <span className="block h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
            </span>
          </button>
          <span className="w-16 text-right text-sm text-muted tabular-nums">
            {clock(time)}/{clock(duration || durationHint || 0)}
          </span>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full bg-raised text-fg"
            onClick={() => setMuted((value) => !value)}
            aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      ) : null}
    </div>
  );
}
