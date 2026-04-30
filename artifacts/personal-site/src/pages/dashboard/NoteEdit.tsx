import { useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListNotes,
  useCreateNote,
  useUpdateNote,
  getListNotesQueryKey,
  getGetNoteQueryKey,
  type NoteInput,
} from "@workspace/api-client-react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Field } from "./PostEdit";
import { ImageUploadField } from "@/components/ImageUploadField";

const schema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  coverImageUrl: z.string().nullable().optional(),
  published: z.boolean(),
});

const inputCls =
  "w-full rounded-md border border-[hsl(40,20%,82%)] bg-background px-3 py-2 text-sm focus:border-[hsl(348,70%,55%)] focus:outline-none focus:ring-2 focus:ring-[hsl(348,70%,55%)]/20 transition-colors";

export default function NoteEdit() {
  const [, params] = useRoute("/notes/:id");
  const [, setLocation] = useLocation();
  const isNew = !params || params.id === "new";
  const id = !isNew ? Number(params!.id) : undefined;

  const { data: notes } = useListNotes();
  const note = id ? notes?.find((n) => n.id === id) : undefined;

  const qc = useQueryClient();
  const create = useCreateNote();
  const update = useUpdateNote();

  const form = useForm<NoteInput>({
    resolver: zodResolver(schema),
    defaultValues: { slug: "", title: "", excerpt: "", content: "", coverImageUrl: null, published: false },
  });

  useEffect(() => {
    if (note) {
      form.reset({
        slug: note.slug,
        title: note.title,
        excerpt: note.excerpt,
        content: note.content,
        coverImageUrl: note.coverImageUrl ?? null,
        published: note.published,
      });
    }
  }, [note, form]);

  const submit = form.handleSubmit(async (values) => {
    try {
      if (isNew) {
        await create.mutateAsync({ data: values });
        toast.success("Note created");
      } else if (id) {
        await update.mutateAsync({ id, data: values });
        toast.success("Note updated");
        qc.invalidateQueries({ queryKey: getGetNoteQueryKey(values.slug) });
      }
      qc.invalidateQueries({ queryKey: getListNotesQueryKey() });
      qc.invalidateQueries({ queryKey: getListNotesQueryKey({ published: true }) });
      setLocation("/notes");
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    }
  });

  const saving = create.isPending || update.isPending;

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <Link href="/notes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All notes
      </Link>
      <header>
        <h1 className="font-serif text-3xl">{isNew ? "New note" : "Edit note"}</h1>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" error={form.formState.errors.title?.message}>
          <input className={inputCls} {...form.register("title")} />
        </Field>
        <Field label="Slug" error={form.formState.errors.slug?.message}>
          <input className={inputCls} {...form.register("slug")} />
        </Field>
      </div>
      <Field label="Excerpt">
        <input className={inputCls} {...form.register("excerpt")} />
      </Field>
      <ImageUploadField
        value={form.watch("coverImageUrl")}
        onChange={(p) => form.setValue("coverImageUrl", p, { shouldDirty: true })}
      />
      <Field label="Content">
        <textarea rows={12} className={`${inputCls} font-mono text-sm resize-y`} {...form.register("content")} />
      </Field>
      <Field label="">
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-[hsl(348,70%,55%)]" {...form.register("published")} />
          <span className="text-sm">Published</span>
        </label>
      </Field>
      <div className="flex items-center gap-3 pt-3 border-t border-[hsl(40,20%,88%)]">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-[hsl(348,70%,55%)] hover:bg-[hsl(348,70%,48%)] disabled:opacity-50 text-white px-4 py-2 text-sm font-medium shadow-sm transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isNew ? "Create note" : "Save changes"}
        </button>
        <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link>
      </div>
    </form>
  );
}
