import { useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListProjects,
  useCreateProject,
  useUpdateProject,
  getListProjectsQueryKey,
  type ProjectInput,
} from "@workspace/api-client-react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Field } from "./PostEdit";

const schema = z.object({
  title: z.string().min(1),
  description: z.string(),
  year: z.coerce.number().int().min(1900).max(3000),
  articleUrl: z.string().url().or(z.literal("")).nullable().optional(),
  demoUrl: z.string().url().or(z.literal("")).nullable().optional(),
  sourceUrl: z.string().url().or(z.literal("")).nullable().optional(),
  published: z.boolean(),
});

const inputCls =
  "w-full rounded-md border border-[hsl(40,20%,82%)] bg-background px-3 py-2 text-sm focus:border-[hsl(348,70%,55%)] focus:outline-none focus:ring-2 focus:ring-[hsl(348,70%,55%)]/20 transition-colors";

export default function ProjectEdit() {
  const [, params] = useRoute("/dashboard/projects/:id");
  const [, setLocation] = useLocation();
  const isNew = !params || params.id === "new";
  const id = !isNew ? Number(params!.id) : undefined;

  const { data: projects } = useListProjects();
  const project = id ? projects?.find((p) => p.id === id) : undefined;

  const qc = useQueryClient();
  const create = useCreateProject();
  const update = useUpdateProject();

  const form = useForm<ProjectInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      year: new Date().getFullYear(),
      articleUrl: "",
      demoUrl: "",
      sourceUrl: "",
      published: false,
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        year: project.year,
        articleUrl: project.articleUrl ?? "",
        demoUrl: project.demoUrl ?? "",
        sourceUrl: project.sourceUrl ?? "",
        published: project.published,
      });
    }
  }, [project, form]);

  const submit = form.handleSubmit(async (values) => {
    const data: ProjectInput = {
      ...values,
      articleUrl: values.articleUrl || null,
      demoUrl: values.demoUrl || null,
      sourceUrl: values.sourceUrl || null,
    };
    try {
      if (isNew) {
        await create.mutateAsync({ data });
        toast.success("Project created");
      } else if (id) {
        await update.mutateAsync({ id, data });
        toast.success("Project updated");
      }
      qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      qc.invalidateQueries({ queryKey: getListProjectsQueryKey({ published: true }) });
      setLocation("/dashboard/projects");
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    }
  });

  const saving = create.isPending || update.isPending;

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
      <header>
        <h1 className="font-serif text-3xl">{isNew ? "New project" : "Edit project"}</h1>
      </header>
      <div className="grid sm:grid-cols-[1fr_120px] gap-4">
        <Field label="Title" error={form.formState.errors.title?.message}>
          <input className={inputCls} {...form.register("title")} />
        </Field>
        <Field label="Year" error={form.formState.errors.year?.message}>
          <input type="number" className={inputCls} {...form.register("year")} />
        </Field>
      </div>
      <Field label="Description">
        <textarea rows={3} className={`${inputCls} resize-y`} {...form.register("description")} />
      </Field>
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Article URL" error={form.formState.errors.articleUrl?.message}>
          <input className={inputCls} {...form.register("articleUrl")} placeholder="https://…" />
        </Field>
        <Field label="Demo URL" error={form.formState.errors.demoUrl?.message}>
          <input className={inputCls} {...form.register("demoUrl")} placeholder="https://…" />
        </Field>
        <Field label="Source URL" error={form.formState.errors.sourceUrl?.message}>
          <input className={inputCls} {...form.register("sourceUrl")} placeholder="https://…" />
        </Field>
      </div>
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
          {isNew ? "Create project" : "Save changes"}
        </button>
        <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link>
      </div>
    </form>
  );
}
