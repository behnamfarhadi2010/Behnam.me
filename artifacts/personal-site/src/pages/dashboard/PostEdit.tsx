import { useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListPosts,
  useCreatePost,
  useUpdatePost,
  getListPostsQueryKey,
  getGetPostQueryKey,
  type PostInput,
} from "@workspace/api-client-react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const schema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string(),
  content: z.string(),
  published: z.boolean(),
});

export default function PostEdit() {
  const [, params] = useRoute("/posts/:id");
  const [, setLocation] = useLocation();
  const isNew = !params || params.id === "new";
  const id = !isNew ? Number(params!.id) : undefined;

  const { data: posts } = useListPosts();
  const post = id ? posts?.find((p) => p.id === id) : undefined;

  const qc = useQueryClient();
  const create = useCreatePost();
  const update = useUpdatePost();

  const form = useForm<PostInput>({
    resolver: zodResolver(schema),
    defaultValues: { slug: "", title: "", excerpt: "", content: "", published: false },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        published: post.published,
      });
    }
  }, [post, form]);

  const submit = form.handleSubmit(async (values) => {
    try {
      if (isNew) {
        await create.mutateAsync({ data: values });
        toast.success("Post created");
      } else if (id) {
        await update.mutateAsync({ id, data: values });
        toast.success("Post updated");
        qc.invalidateQueries({ queryKey: getGetPostQueryKey(values.slug) });
      }
      qc.invalidateQueries({ queryKey: getListPostsQueryKey() });
      qc.invalidateQueries({ queryKey: getListPostsQueryKey({ published: true }) });
      setLocation("/posts");
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    }
  });

  const saving = create.isPending || update.isPending;

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <Link href="/posts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>
      <header>
        <h1 className="font-serif text-3xl">{isNew ? "New post" : "Edit post"}</h1>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" error={form.formState.errors.title?.message}>
          <input className={inputCls} {...form.register("title")} placeholder="A short, intriguing title" />
        </Field>
        <Field label="Slug" error={form.formState.errors.slug?.message}>
          <input className={inputCls} {...form.register("slug")} placeholder="kebab-case-slug" />
        </Field>
      </div>
      <Field label="Excerpt">
        <input className={inputCls} {...form.register("excerpt")} placeholder="One-sentence teaser" />
      </Field>
      <Field label="Content">
        <textarea
          rows={16}
          className={`${inputCls} font-mono text-sm leading-relaxed resize-y`}
          {...form.register("content")}
          placeholder="Write the post body here. Plain text or markdown-ish — newlines are preserved."
        />
      </Field>
      <Field label="">
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-[hsl(348,70%,55%)]" {...form.register("published")} />
          <span className="text-sm">Published (visible on the public site)</span>
        </label>
      </Field>
      <div className="flex items-center gap-3 pt-3 border-t border-[hsl(40,20%,88%)]">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-[hsl(348,70%,55%)] hover:bg-[hsl(348,70%,48%)] disabled:opacity-50 text-white px-4 py-2 text-sm font-medium shadow-sm transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isNew ? "Create post" : "Save changes"}
        </button>
        <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </Link>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-[hsl(40,20%,82%)] bg-background px-3 py-2 text-sm focus:border-[hsl(348,70%,55%)] focus:outline-none focus:ring-2 focus:ring-[hsl(348,70%,55%)]/20 transition-colors";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-foreground/80">{label}</label>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
