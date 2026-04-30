import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListNotes,
  useDeleteNote,
  getListNotesQueryKey,
} from "@workspace/api-client-react";
import { fmtDate } from "@/lib/format";
import { Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
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
import { ManageHeader, Empty } from "./PostsManage";

export default function NotesManage() {
  const { data, isLoading } = useListNotes();
  const qc = useQueryClient();
  const del = useDeleteNote({
    mutation: {
      onSuccess: () => {
        toast.success("Note deleted");
        qc.invalidateQueries({ queryKey: getListNotesQueryKey() });
        qc.invalidateQueries({ queryKey: getListNotesQueryKey({ published: true }) });
      },
      onError: (e) => toast.error(`Delete failed: ${(e as Error).message}`),
    },
  });

  return (
    <div className="space-y-6">
      <ManageHeader title="Notes" subtitle="Shorter, in-progress thoughts." newHref="/notes/new" />
      <div className="rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-[hsl(40,20%,90%)] animate-pulse" />
            ))}
          </div>
        ) : (data ?? []).length === 0 ? (
          <Empty entity="note" newHref="/notes/new" />
        ) : (
          <ul className="divide-y divide-[hsl(40,20%,90%)]">
            {(data ?? []).map((n) => (
              <li key={n.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-[hsl(40,40%,96%)] transition-colors">
                <Link href={`/notes/${n.id}`} className="flex-1 min-w-0 flex items-center gap-3">
                  {n.published ? (
                    <CheckCircle2 className="h-4 w-4 text-[hsl(150,50%,45%)] shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{n.title}</div>
                    <div className="text-xs text-muted-foreground">/{n.slug} · updated {fmtDate(n.updatedAt)}</div>
                  </div>
                </Link>
                <Link
                  href={`/notes/${n.id}`}
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
                      <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                      <AlertDialogDescription>
                        &ldquo;{n.title}&rdquo; will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => del.mutate({ id: n.id })}
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
