import { Link, useRoute } from "wouter";
import { useGetNote, getGetNoteQueryKey } from "@workspace/api-client-react";
import { fmtDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

export default function NoteDetail() {
  const [, params] = useRoute("/notes/:slug");
  const slug = params?.slug ?? "";
  const { data: note, isLoading, error } = useGetNote(slug, {
    query: { enabled: !!slug, queryKey: getGetNoteQueryKey(slug) },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-3">
        <div className="h-10 w-2/3 rounded bg-[hsl(40,20%,88%)] animate-pulse" />
        <div className="h-4 w-32 rounded bg-[hsl(40,20%,90%)] animate-pulse" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl">Note not found</h1>
        <Link
          href="/notes"
          className="mt-4 inline-flex items-center gap-2 text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to notes
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link
        href="/notes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[hsl(348,70%,50%)] mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All notes
      </Link>
      <header className="border-b border-[hsl(40,20%,88%)] pb-6 mb-8 space-y-3">
        <time className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {fmtDate(note.createdAt)}
        </time>
        <h1 className="font-serif text-3xl sm:text-4xl leading-tight">{note.title}</h1>
        {note.excerpt && (
          <p className="text-lg text-foreground/75 italic">{note.excerpt}</p>
        )}
      </header>
      <div className="prose prose-stone max-w-none whitespace-pre-wrap leading-relaxed">
        {note.content}
      </div>
    </article>
  );
}
