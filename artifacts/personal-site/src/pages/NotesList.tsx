import { Link } from "wouter";
import { useListNotes } from "@workspace/api-client-react";
import { fmtShortDate } from "@/lib/format";
import { imageSrc } from "@/components/ImageUploadField";
import { ArrowRight } from "lucide-react";

export default function NotesList() {
  const { data, isLoading, error } = useListNotes({ published: true });
  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-3">
        <div className="h-10 w-32 rounded bg-[hsl(40,20%,88%)] animate-pulse" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-[hsl(40,20%,90%)] animate-pulse" />
        ))}
      </div>
    );
  }
  if (error) return <p className="text-destructive">Failed to load notes.</p>;

  const notes = data ?? [];

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="space-y-3">
        <h1 className="font-serif text-4xl">Notes</h1>
        <p className="text-foreground/70">
          Shorter, more frequent thoughts — work-in-progress ideas, retrospectives,
          and links worth saving.
        </p>
      </header>
      {notes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[hsl(40,20%,80%)] bg-[hsl(40,40%,95%)] p-12 text-center">
          <p className="font-serif text-xl">No notes yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[hsl(40,20%,88%)]">
          {notes.map((n) => {
            const cover = imageSrc(n.coverImageUrl);
            return (
              <li key={n.id}>
                <Link
                  href={`/notes/${n.slug}`}
                  className="group block py-4 -mx-3 px-3 rounded-md hover:bg-[hsl(40,40%,95%)] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <time className="w-16 shrink-0 text-sm text-muted-foreground tabular-nums pt-1">
                      {fmtShortDate(n.createdAt)}
                    </time>
                    {cover && (
                      <img
                        src={cover}
                        alt=""
                        className="hidden sm:block h-14 w-20 shrink-0 rounded object-cover border border-[hsl(40,20%,88%)]"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-4">
                        <h3 className="flex-1 font-medium group-hover:text-[hsl(348,70%,45%)] transition-colors">
                          {n.title}
                        </h3>
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[hsl(348,70%,55%)]" />
                      </div>
                      {n.excerpt && (
                        <p className="mt-1 text-sm text-foreground/70 line-clamp-2">
                          {n.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
