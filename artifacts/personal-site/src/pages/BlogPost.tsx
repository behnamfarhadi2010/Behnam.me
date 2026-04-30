import { Link, useRoute } from "wouter";
import { useGetPost, getGetPostQueryKey } from "@workspace/api-client-react";
import { fmtDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const { data: post, isLoading, error } = useGetPost(slug, {
    query: { enabled: !!slug, queryKey: getGetPostQueryKey(slug) },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <div className="h-10 w-2/3 rounded bg-[hsl(40,20%,88%)] animate-pulse" />
        <div className="h-4 w-32 rounded bg-[hsl(40,20%,90%)] animate-pulse" />
        <div className="space-y-2 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-[hsl(40,20%,92%)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl">Post not found</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn&apos;t find that post. It may have been moved or unpublished.
        </p>
        <Link
          href="/blog"
          className="mt-4 inline-flex items-center gap-2 text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[hsl(348,70%,50%)] mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>
      <header className="border-b border-[hsl(40,20%,88%)] pb-6 mb-8 space-y-3">
        <time className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {fmtDate(post.createdAt)}
        </time>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-foreground/75 italic">{post.excerpt}</p>
        )}
      </header>
      <div className="prose prose-stone max-w-none whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </article>
  );
}
