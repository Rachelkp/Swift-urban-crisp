import { Link } from "@tanstack/react-router";
import { Clapperboard } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex min-h-11 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-accent text-ink">
            <Clapperboard className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold">ซีนลิงก์</span>
        </Link>
        <p className="text-sm text-muted">โปรโมทจากลิงก์ X</p>
      </div>
    </header>
  );
}
