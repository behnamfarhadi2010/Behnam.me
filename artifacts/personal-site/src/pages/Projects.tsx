import { useListProjects } from "@workspace/api-client-react";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  const { data, isLoading, error } = useListProjects({ published: true });
  if (isLoading) {
    return (
      <div className="max-w-4xl grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-[hsl(40,20%,90%)] animate-pulse" />
        ))}
      </div>
    );
  }
  if (error) return <p className="text-destructive">Failed to load projects.</p>;
  const projects = data ?? [];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="space-y-3">
        <h1 className="font-serif text-4xl">Projects</h1>
        <p className="text-foreground/70">
          A handful of things I&apos;ve built, scratched my own itch with, or open
          sourced over the years.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[hsl(40,20%,80%)] bg-[hsl(40,40%,95%)] p-12 text-center">
          <p className="font-serif text-xl">No projects yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <article
              key={p.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className="group relative overflow-hidden rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] p-6 hover:border-[hsl(348,70%,70%)] hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-1 duration-500"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[hsl(348,75%,80%)] to-[hsl(20,75%,80%)] opacity-0 group-hover:opacity-30 transition-opacity blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl leading-tight group-hover:text-[hsl(348,70%,45%)] transition-colors">
                  {p.title}
                </h3>
                <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
                  {p.year}
                </span>
              </div>
              <p className="relative mt-2 text-sm text-foreground/80">
                {p.description}
              </p>
              {(p.demoUrl || p.sourceUrl || p.articleUrl) && (
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {p.demoUrl && (
                    <PillLink href={p.demoUrl} label="Demo" />
                  )}
                  {p.sourceUrl && (
                    <PillLink href={p.sourceUrl} label="Source" />
                  )}
                  {p.articleUrl && (
                    <PillLink href={p.articleUrl} label="Article" />
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-[hsl(40,20%,85%)] bg-background px-3 py-1 text-xs font-medium text-[hsl(230,60%,50%)] hover:bg-[hsl(230,60%,95%)] hover:border-[hsl(230,60%,70%)] transition-colors"
    >
      {label} <ExternalLink className="h-3 w-3" />
    </a>
  );
}
