import { Link } from "wouter";
import {
  useGetDashboardSummary,
  useGetRecentActivity,
} from "@workspace/api-client-react";
import { fmtRelative } from "@/lib/format";
import { FileText, StickyNote, Hammer, ArrowRight, Circle, CheckCircle2 } from "lucide-react";

export default function DashboardOverview() {
  const { data: summary } = useGetDashboardSummary();
  const { data: activity } = useGetRecentActivity();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl">Studio</h1>
        <p className="text-muted-foreground">
          An overview of everything you&apos;ve published, drafted, and are tinkering with.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4">
        <StatCard
          to="/posts"
          icon={<FileText className="h-5 w-5" />}
          label="Posts"
          published={summary?.postsPublished ?? 0}
          total={summary?.postsTotal ?? 0}
        />
        <StatCard
          to="/notes"
          icon={<StickyNote className="h-5 w-5" />}
          label="Notes"
          published={summary?.notesPublished ?? 0}
          total={summary?.notesTotal ?? 0}
        />
        <StatCard
          to="/projects"
          icon={<Hammer className="h-5 w-5" />}
          label="Projects"
          published={summary?.projectsPublished ?? 0}
          total={summary?.projectsTotal ?? 0}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl">Recent activity</h2>
        <div className="rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] divide-y divide-[hsl(40,20%,90%)]">
          {(activity ?? []).length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground italic">No recent activity yet.</p>
          ) : (
            (activity ?? []).map((a, i) => {
              const link =
                a.kind === "post"
                  ? `/posts/${a.id}`
                  : a.kind === "note"
                  ? `/notes/${a.id}`
                  : `/projects/${a.id}`;
              const Icon = a.kind === "post" ? FileText : a.kind === "note" ? StickyNote : Hammer;
              return (
                <Link
                  key={`${a.kind}-${a.id}-${i}`}
                  href={link}
                  className="group flex items-center gap-4 px-5 py-3 hover:bg-[hsl(40,40%,96%)] transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[hsl(40,40%,93%)] text-[hsl(348,70%,50%)] group-hover:bg-[hsl(348,70%,55%)] group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                        {a.kind}
                      </span>
                      {a.published ? (
                        <CheckCircle2 className="h-3 w-3 text-[hsl(150,50%,45%)]" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="font-medium truncate group-hover:text-[hsl(348,70%,45%)] transition-colors">
                      {a.title}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {fmtRelative(a.updatedAt)}
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[hsl(348,70%,55%)]" />
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  to,
  icon,
  label,
  published,
  total,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  published: number;
  total: number;
}) {
  return (
    <Link
      href={to}
      className="group relative overflow-hidden rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] p-5 hover:border-[hsl(348,70%,70%)] hover:shadow-md transition-all"
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[hsl(348,75%,85%)] to-[hsl(20,75%,85%)] opacity-0 group-hover:opacity-50 transition-opacity blur-2xl" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[hsl(40,40%,93%)] text-[hsl(348,70%,50%)] group-hover:bg-[hsl(348,70%,55%)] group-hover:text-white transition-colors">
          {icon}
        </div>
        <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="relative mt-4 flex items-baseline gap-2">
        <span className="font-serif text-4xl">{published}</span>
        <span className="text-sm text-muted-foreground">published of {total}</span>
      </div>
    </Link>
  );
}
