import { Link } from "wouter";
import { useListPosts } from "@workspace/api-client-react";
import { fmtShortDate } from "@/lib/format";
import { imageSrc } from "@/components/ImageUploadField";
import { ArrowRight } from "lucide-react";

export default function BlogList() {
  const { data, isLoading, error } = useListPosts({ published: true });

  if (isLoading) return <ListSkeleton />;
  if (error) return <p className="text-destructive">Failed to load posts.</p>;

  const posts = data ?? [];
  const grouped = groupByYear(posts.map((p) => ({ ...p, when: p.createdAt })));

  return (
    <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="space-y-3">
        <h1 className="font-serif text-4xl">Blog</h1>
        <p className="text-foreground/70">
          Long-form posts on building things on the web — patterns, deep dives, and
          the occasional opinion.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[hsl(40,20%,80%)] bg-[hsl(40,40%,95%)] p-12 text-center">
          <p className="font-serif text-xl">No posts yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon — fresh writing is on the way.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([year, items]) => (
          <section key={year} className="space-y-2">
            <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
              {year}
            </h2>
            <ul className="divide-y divide-[hsl(40,20%,88%)]">
              {items.map((p) => {
                const cover = imageSrc(p.coverImageUrl);
                return (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-center gap-4 py-3 -mx-3 px-3 rounded-md hover:bg-[hsl(40,40%,95%)] transition-colors"
                    >
                      <time className="w-16 shrink-0 text-sm text-muted-foreground tabular-nums self-baseline pt-1">
                        {fmtShortDate(p.when)}
                      </time>
                      {cover && (
                        <img
                          src={cover}
                          alt=""
                          className="hidden sm:block h-14 w-20 shrink-0 rounded object-cover border border-[hsl(40,20%,88%)]"
                        />
                      )}
                      <span className="flex-1 group-hover:text-[hsl(348,70%,45%)] transition-colors">
                        {p.title}
                      </span>
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[hsl(348,70%,55%)]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-32 rounded bg-[hsl(40,20%,88%)] animate-pulse" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-[hsl(40,20%,90%)] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function groupByYear<T extends { when: string }>(items: T[]) {
  const out: Record<string, T[]> = {};
  for (const it of items) {
    const y = new Date(it.when).getFullYear().toString();
    (out[y] ??= []).push(it);
  }
  return Object.fromEntries(
    Object.entries(out).sort(([a], [b]) => Number(b) - Number(a)),
  );
}
