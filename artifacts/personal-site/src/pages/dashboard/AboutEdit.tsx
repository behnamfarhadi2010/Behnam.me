import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAbout,
  useUpdateAbout,
  getGetAboutQueryKey,
  type AboutInput,
} from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Field } from "./PostEdit";

const schema = z.object({
  name: z.string().min(1),
  tagline: z.string(),
  intro: z.string(),
  bio: z.string(),
  emailNewsletter: z.string(),
  blueskyUrl: z.string(),
  rssUrl: z.string(),
});

const inputCls =
  "w-full rounded-md border border-[hsl(40,20%,82%)] bg-background px-3 py-2 text-sm focus:border-[hsl(348,70%,55%)] focus:outline-none focus:ring-2 focus:ring-[hsl(348,70%,55%)]/20 transition-colors";

export default function AboutEdit() {
  const { data: about, isLoading } = useGetAbout();
  const qc = useQueryClient();
  const update = useUpdateAbout({
    mutation: {
      onSuccess: () => {
        toast.success("About updated");
        qc.invalidateQueries({ queryKey: getGetAboutQueryKey() });
      },
      onError: (e) => toast.error(`Save failed: ${(e as Error).message}`),
    },
  });

  const form = useForm<AboutInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      tagline: "",
      intro: "",
      bio: "",
      emailNewsletter: "",
      blueskyUrl: "",
      rssUrl: "",
    },
  });

  useEffect(() => {
    if (about) {
      form.reset({
        name: about.name,
        tagline: about.tagline,
        intro: about.intro,
        bio: about.bio,
        emailNewsletter: about.emailNewsletter,
        blueskyUrl: about.blueskyUrl,
        rssUrl: about.rssUrl,
      });
    }
  }, [about, form]);

  if (isLoading) {
    return <div className="h-64 rounded bg-[hsl(40,20%,90%)] animate-pulse" />;
  }

  const submit = form.handleSubmit((values) => update.mutate({ data: values }));

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <header>
        <h1 className="font-serif text-3xl">About page</h1>
        <p className="text-sm text-muted-foreground">
          The intro, bio, and contact links shown across the public site.
        </p>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" error={form.formState.errors.name?.message}>
          <input className={inputCls} {...form.register("name")} />
        </Field>
        <Field label="Tagline">
          <input className={inputCls} {...form.register("tagline")} />
        </Field>
      </div>
      <Field label="Intro (short)">
        <textarea rows={3} className={`${inputCls} resize-y`} {...form.register("intro")} />
      </Field>
      <Field label="Bio (long)">
        <textarea rows={10} className={`${inputCls} resize-y`} {...form.register("bio")} />
      </Field>
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Newsletter URL">
          <input className={inputCls} {...form.register("emailNewsletter")} />
        </Field>
        <Field label="Bluesky URL">
          <input className={inputCls} {...form.register("blueskyUrl")} />
        </Field>
        <Field label="RSS URL">
          <input className={inputCls} {...form.register("rssUrl")} />
        </Field>
      </div>
      <div className="flex items-center gap-3 pt-3 border-t border-[hsl(40,20%,88%)]">
        <button
          type="submit"
          disabled={update.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-[hsl(348,70%,55%)] hover:bg-[hsl(348,70%,48%)] disabled:opacity-50 text-white px-4 py-2 text-sm font-medium shadow-sm transition-colors"
        >
          {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
    </form>
  );
}
