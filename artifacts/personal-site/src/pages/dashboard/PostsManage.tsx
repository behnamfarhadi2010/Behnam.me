import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListPosts,
  useDeletePost,
  getListPostsQueryKey,
} from "@workspace/api-client-react";
import { fmtDate } from "@/lib/format";
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PostsManage() {
  const { data, isLoading } = useListPosts();
  const qc = useQueryClient();
  const del = useDeletePost({
    mutation: {
      onSuccess: () => {
        toast.success("Post deleted");
        qc.invalidateQueries({ queryKey: getListPostsQueryKey() });
        qc.invalidateQueries({ queryKey: getListPostsQueryKey({ published: true }) });
      },
      onError: (e) => toast.error(`Delete failed: ${(e as Error).message}`),
    },
  });

  return (
    <div className="space-y-6">
      <ManageHeader title="Posts" subtitle="Long-form essays and tutorials." newHref="/posts/new" />
      <div className="rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-[hsl(40,20%,90%)] animate-pulse" />
            ))}
          </div>
        ) : (data ?? []).length === 0 ? (
          <Empty entity="post" newHref="/posts/new" />
        ) : (
          <ul className="divide-y divide-[hsl(40,20%,90%)]">
            {(data ?? []).map((p) => (
              <li key={p.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-[hsl(40,40%,96%)] transition-colors">
                <Link href={`/posts/${p.id}`} className="flex-1 min-w-0 flex items-center gap-3">
                  {p.published ? (
                    <CheckCircle2 className="h-4 w-4 text-[hsl(150,50%,45%)] shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug} · updated {fmtDate(p.updatedAt)}</div>
                  </div>
                </Link>
                <Link
                  href={`/posts/${p.id}`}
                  className="p-2 rounded-md text-muted-foreground hover:bg-[hsl(40,40%,93%)] hover:text-foreground transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                      <AlertDialogDescription>
                        &ldquo;{p.title}&rdquo; will be permanently removed. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => del.mutate({ id: p.id })}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ManageHeader({ title, subtitle, newHref }: { title: string; subtitle: string; newHref: string }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-serif text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        href={newHref}
        className="inline-flex items-center gap-2 rounded-md bg-[hsl(348,70%,55%)] hover:bg-[hsl(348,70%,48%)] text-white px-4 py-2 text-sm font-medium shadow-sm transition-colors"
      >
        <Plus className="h-4 w-4" /> New
      </Link>
    </header>
  );
}

export function Empty({ entity, newHref }: { entity: string; newHref: string }) {
  return (
    <div className="p-12 text-center space-y-3">
      <p className="font-serif text-xl">No {entity}s yet.</p>
      <p className="text-sm text-muted-foreground">Get started by creating your first {entity}.</p>
      <Link
        href={newHref}
        className="inline-flex items-center gap-2 rounded-md bg-[hsl(348,70%,55%)] hover:bg-[hsl(348,70%,48%)] text-white px-4 py-2 text-sm font-medium shadow-sm transition-colors"
      >
        <Plus className="h-4 w-4" /> New {entity}
      </Link>
    </div>
  );
}
