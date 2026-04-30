import { useGetAbout } from "@workspace/api-client-react";
import { imageSrc } from "@/components/ImageUploadField";
import { Mail, MessageCircle, Rss } from "lucide-react";

export default function About() {
  const { data: about, isLoading } = useGetAbout();

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-3">
        <div className="h-10 w-48 rounded bg-[hsl(40,20%,88%)] animate-pulse" />
        <div className="h-32 rounded bg-[hsl(40,20%,90%)] animate-pulse" />
      </div>
    );
  }

  if (!about) return <p className="text-muted-foreground">No about content.</p>;

  return (
    <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-start gap-6">
        {imageSrc(about.avatarUrl) && (
          <img
            src={imageSrc(about.avatarUrl)}
            alt={about.name}
            className="h-24 w-24 shrink-0 rounded-full object-cover border-2 border-[hsl(40,20%,88%)] shadow-sm"
          />
        )}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl">About</h1>
          <p className="text-foreground/70">{about.tagline}</p>
        </div>
      </header>

      <section className="space-y-6">
        <p className="text-lg leading-relaxed">{about.intro}</p>
        <div className="prose prose-stone max-w-none whitespace-pre-wrap leading-relaxed">
          {about.bio}
        </div>
      </section>

      <section className="rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] p-6">
        <h2 className="font-serif text-xl mb-4">Find me elsewhere</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {about.emailNewsletter && (
            <Card href={about.emailNewsletter} icon={<Mail className="h-5 w-5" />} title="Newsletter" subtitle="Subscribe by email" />
          )}
          {about.blueskyUrl && (
            <Card href={about.blueskyUrl} icon={<MessageCircle className="h-5 w-5" />} title="Bluesky" subtitle="Follow me there" />
          )}
          {about.rssUrl && (
            <Card href={about.rssUrl} icon={<Rss className="h-5 w-5" />} title="RSS" subtitle="Subscribe via RSS" />
          )}
        </div>
      </section>
    </div>
  );
}

function Card({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-md border border-[hsl(40,20%,88%)] bg-background p-3 hover:border-[hsl(348,70%,70%)] hover:bg-[hsl(40,40%,96%)] transition-colors"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[hsl(40,40%,93%)] text-[hsl(348,70%,50%)] group-hover:bg-[hsl(348,70%,55%)] group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </a>
  );
}
