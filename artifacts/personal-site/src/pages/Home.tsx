import { Link } from "wouter";
import {
  useListPosts,
  useListNotes,
  useListProjects,
  useGetAbout,
} from "@workspace/api-client-react";
import { fmtShortDate } from "@/lib/format";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function Home() {
  const { data: about } = useGetAbout();
  const { data: posts } = useListPosts({ published: true });
  const { data: notes } = useListNotes({ published: true });
  const { data: projects } = useListProjects({ published: true });

  const recentPosts = (posts ?? []).slice(0, 5);
  const recentNotes = (notes ?? []).slice(0, 5);
  const featuredProjects = (projects ?? []).slice(0, 4);

  return (
    <div className="space-y-20 max-w-3xl">
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          Hi, I&apos;m{" "}
          <span className="text-[hsl(348,70%,50%)]">{about?.name ?? "—"}</span>.
        </h1>
        <p className="text-lg leading-relaxed text-foreground/85">
          {about?.intro}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/about"
            className="text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)] underline-offset-4 hover:underline"
          >
            More about me
          </Link>
          <Link
            href="/blog"
            className="text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)] underline-offset-4 hover:underline"
          >
            Read the blog
          </Link>
          <Link
            href="/projects"
            className="text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)] underline-offset-4 hover:underline"
          >
            See projects
          </Link>
        </div>
      </section>

      <Section title="Latest Posts" linkTo="/blog" linkLabel="All posts">
        <ul className="divide-y divide-[hsl(40,20%,88%)]">
          {recentPosts.length === 0 && <Empty label="No posts yet." />}
          {recentPosts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex items-baseline gap-4 py-3 hover:bg-[hsl(40,40%,95%)] -mx-3 px-3 rounded-md transition-colors"
              >
                <time className="w-16 shrink-0 text-sm text-muted-foreground tabular-nums">
                  {fmtShortDate(p.createdAt)}
                </time>
                <span className="flex-1 group-hover:text-[hsl(348,70%,45%)] transition-colors">
                  {p.title}
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[hsl(348,70%,55%)]" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Latest Notes" linkTo="/notes" linkLabel="All notes">
        <ul className="divide-y divide-[hsl(40,20%,88%)]">
          {recentNotes.length === 0 && <Empty label="No notes yet." />}
          {recentNotes.map((n) => (
            <li key={n.id}>
              <Link
                href={`/notes/${n.slug}`}
                className="group flex items-baseline gap-4 py-3 hover:bg-[hsl(40,40%,95%)] -mx-3 px-3 rounded-md transition-colors"
              >
                <time className="w-16 shrink-0 text-sm text-muted-foreground tabular-nums">
                  {fmtShortDate(n.createdAt)}
                </time>
                <span className="flex-1 group-hover:text-[hsl(348,70%,45%)] transition-colors">
                  {n.title}
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[hsl(348,70%,55%)]" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Featured Projects" linkTo="/projects" linkLabel="All projects">
        <div className="grid sm:grid-cols-2 gap-4">
          {featuredProjects.length === 0 && <Empty label="No projects yet." />}
          {featuredProjects.map((p) => (
            <article
              key={p.id}
              className="group rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] p-5 hover:border-[hsl(348,70%,70%)] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg leading-tight group-hover:text-[hsl(348,70%,45%)] transition-colors">
                  {p.title}
                </h3>
                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                  {p.year}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/80">{p.description}</p>
              {(p.demoUrl || p.sourceUrl || p.articleUrl) && (
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {p.demoUrl && (
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)]"
                    >
                      Demo <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {p.sourceUrl && (
                    <a
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)]"
                    >
                      Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {p.articleUrl && (
                    <a
                      href={p.articleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)]"
                    >
                      Article <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  linkTo,
  linkLabel,
  children,
}: {
  title: string;
  linkTo: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between border-b border-[hsl(40,20%,88%)] pb-2">
        <h2 className="font-serif text-2xl">{title}</h2>
        <Link
          href={linkTo}
          className="text-sm text-[hsl(230,60%,50%)] hover:text-[hsl(230,60%,40%)] inline-flex items-center gap-1"
        >
          {linkLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-sm text-muted-foreground italic py-4">{label}</div>;
}
