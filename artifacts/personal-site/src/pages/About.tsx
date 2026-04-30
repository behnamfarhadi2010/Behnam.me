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



  return (
    <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-start gap-6">
        {about?.avatarUrl && imageSrc(about.avatarUrl) && (
          <img
            src={imageSrc(about.avatarUrl)}
            alt={about?.name ?? "Behnam"}
            className="h-24 w-24 shrink-0 rounded-full object-cover border-2 border-[hsl(40,20%,88%)] shadow-sm"
          />
        )}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl">{about?.name ?? "Behnam"}</h1>
          <p className="text-foreground/70">{about?.tagline ?? "Software Engineer"}</p>
        </div>
      </header>

      <section className="space-y-6">
        <p className="text-lg leading-relaxed">{about?.intro}</p>
        <div className="prose prose-stone max-w-none whitespace-pre-wrap leading-relaxed">
          {about?.bio}
        </div>
      </section>

      <section className="space-y-8 border-t border-[hsl(40,20%,88%)] pt-10">
        <div>
          <h2 className="font-serif text-3xl flex items-center gap-3">
            Behnam <span className="text-[hsl(348,70%,55%)] font-normal">— بهنام</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/85">
            Behnam is a classical Persian (Farsi) name, composed of two elements:
          </p>
          <ul className="mt-4 space-y-2 list-none">
            <li className="flex items-baseline gap-3">
              <span className="font-serif text-[hsl(348,70%,45%)] text-xl">به (beh)</span> 
              <span className="text-muted-foreground">—</span>
              <span>meaning good, well, excellent</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="font-serif text-[hsl(348,70%,45%)] text-xl">نام (nâm)</span> 
              <span className="text-muted-foreground">—</span>
              <span>meaning name, reputation</span>
            </li>
          </ul>
          <p className="mt-6 italic border-l-4 border-[hsl(348,70%,85%)] pl-4 py-1">
            Together it means &quot;of good name&quot; or &quot;one with a good reputation&quot; — a name that carries dignity and honor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl">Phonetics</h3>
            <div className="overflow-hidden rounded-lg border border-[hsl(40,20%,88%)] bg-background">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-[hsl(40,20%,88%)]">
                  <tr>
                    <td className="px-4 py-2 font-medium bg-[hsl(40,40%,96%)] w-1/2">System</td>
                    <td className="px-4 py-2">Pronunciation</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium bg-[hsl(40,40%,96%)]">IPA</td>
                    <td className="px-4 py-2 font-mono">/beh.næːm/</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium bg-[hsl(40,40%,96%)]">English approximation</td>
                    <td className="px-4 py-2">&quot;Beh-NAAM&quot;</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium bg-[hsl(40,40%,96%)]">Syllables</td>
                    <td className="px-4 py-2">2 — Beh + naam</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium bg-[hsl(40,40%,96%)]">Stress</td>
                    <td className="px-4 py-2">On the second syllable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium bg-[hsl(40,40%,96%)]">Rhymes with</td>
                    <td className="px-4 py-2">&quot;the calm&quot; / &quot;salaam&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl">How to Say It</h3>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                The <span className="font-bold text-[hsl(348,70%,45%)]">&quot;Beh&quot;</span> sounds like the <span className="italic">be</span> in &quot;bed&quot; — short and crisp.
              </p>
              <p>
                The <span className="font-bold text-[hsl(348,70%,45%)]">&quot;naam&quot;</span> sounds like &quot;nahm&quot; — long aa vowel, like in &quot;father&quot; or &quot;calm&quot;.
              </p>
              <p className="flex items-center gap-2 font-serif text-base text-foreground/90">
                The two syllables flow smoothly together: <span className="text-[hsl(348,70%,55%)]">beh-NAAM</span> ✦
              </p>
              <div className="rounded-md bg-[hsl(230,60%,97%)] p-3 border border-[hsl(230,60%,90%)]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[hsl(230,60%,40%)] mb-1">Quick Audio Guide for English Speakers</h4>
                <p className="text-[hsl(230,60%,30%)]">Think of saying &quot;bay-NAHM&quot; but soften the bay to &quot;beh&quot;.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl mb-4">About the Name</h3>
          <p className="leading-relaxed text-foreground/85">
            Behnam has been used in Persian culture for over a thousand years and appears in classical Persian literature. 
            It remains a popular given name across Iran, Afghanistan, Tajikistan, and Persian-speaking diaspora communities 
            worldwide — including, of course, Newfoundland 🇨🇦
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[hsl(40,20%,88%)] bg-[hsl(40,33%,98%)] p-6">
        <h2 className="font-serif text-xl mb-4">Find me elsewhere</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {about?.emailNewsletter && (
            <Card href={about.emailNewsletter} icon={<Mail className="h-5 w-5" />} title="Newsletter" subtitle="Subscribe by email" />
          )}
          {about?.blueskyUrl && (
            <Card href={about.blueskyUrl} icon={<MessageCircle className="h-5 w-5" />} title="Bluesky" subtitle="Follow me there" />
          )}
          {about?.rssUrl && (
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
