import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { StudioApp } from "@/components/studio-app";

type HomeSearch = { u?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    if (typeof search.u !== "string" || search.u.length === 0) return {};
    return { u: Array.from(search.u).slice(0, 500).join("") };
  },
  component: function Home() {
    const { u } = Route.useSearch();
    return (
      <div className="min-h-screen bg-bg text-fg">
        <SiteHeader />
        <StudioApp initialUrl={u ?? ""} />
      </div>
    );
  },
});
