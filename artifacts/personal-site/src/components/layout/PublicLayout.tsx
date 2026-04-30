import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useGetAbout } from "@workspace/api-client-react";
import { useAuth, UserButton } from "@clerk/react";
import { Mail, Rss, MessageCircle, Menu, X, LayoutDashboard } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/notes", label: "Notes" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
];

function NavLinks({ onNav }: { onNav?: () => void }) {
  const [loc] = useLocation();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = loc === n.to || (n.to !== "/" && loc.startsWith(n.to));
        return (
          <Link
            key={n.to}
            href={n.to}
            onClick={onNav}
            className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-[hsl(40,40%,90%)] text-[hsl(348,70%,45%)]"
                : "text-foreground/80 hover:bg-[hsl(40,40%,93%)] hover:text-foreground"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                active ? "bg-[hsl(348,70%,55%)]" : "bg-transparent group-hover:bg-[hsl(348,70%,75%)]"
              }`}
            />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNav }: { onNav?: () => void }) {
  const { data: about } = useGetAbout();
  const { isSignedIn } = useAuth();
  return (
    <div className="flex h-full flex-col gap-8">
      <div>
        <Link href="/" onClick={onNav} className="flex items-center gap-3 group">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(348,75%,65%)] to-[hsl(20,75%,60%)] text-white font-serif text-xl shadow-md">
            {about?.name?.[0] ?? "A"}
          </div>
          <div>
            <div className="font-serif text-lg leading-tight text-foreground">{about?.name ?? "—"}</div>
            <div className="text-xs text-muted-foreground">{about?.tagline ?? ""}</div>
          </div>
        </Link>
      </div>

      {about?.intro && (
        <p className="text-sm leading-relaxed text-foreground/75 border-l-2 border-[hsl(348,70%,75%)] pl-3 italic">
          {about.intro}
        </p>
      )}

      <NavLinks onNav={onNav} />

      <div className="mt-auto space-y-4">
        <div>
          <h4 className="mb-2 font-serif text-sm uppercase tracking-wider text-muted-foreground">
            Stay Connected
          </h4>
          <div className="space-y-2">
            {about?.emailNewsletter && (
              <a
                href={about.emailNewsletter}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-[hsl(348,70%,55%)] transition-colors"
              >
                <Mail className="h-4 w-4" /> Newsletter
              </a>
            )}
            {about?.blueskyUrl && (
              <a
                href={about.blueskyUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-[hsl(230,60%,55%)] transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Bluesky
              </a>
            )}
            {about?.rssUrl && (
              <a
                href={about.rssUrl}
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-[hsl(25,80%,55%)] transition-colors"
              >
                <Rss className="h-4 w-4" /> RSS
              </a>
            )}
          </div>
        </div>

        {isSignedIn && (
          <div className="flex items-center justify-between rounded-md border border-dashed border-[hsl(40,30%,80%)] bg-[hsl(40,40%,95%)] px-3 py-2">
            <Link
              href="/dashboard"
              onClick={onNav}
              className="flex items-center gap-2 text-sm font-medium text-[hsl(348,70%,45%)] hover:text-[hsl(348,70%,35%)]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <UserButton />
          </div>
        )}

        <div className="border-t border-[hsl(40,20%,88%)] pt-3 text-xs text-muted-foreground">
          © {new Date().getFullYear()} — built with care
        </div>
      </div>
    </div>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between border-b border-[hsl(40,20%,88%)] bg-background/80 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <Link href="/" className="font-serif text-lg">
          Personal Site
        </Link>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-md hover:bg-[hsl(40,40%,93%)]"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background animate-in fade-in duration-200">
          <div className="flex justify-end p-4">
            <button onClick={() => setOpen(false)} className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 pb-10">
            <SidebarBody onNav={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-[hsl(40,20%,88%)] min-h-screen sticky top-0 max-h-screen overflow-y-auto p-8">
          <SidebarBody />
        </aside>

        <main className="flex-1 min-w-0 px-5 py-10 sm:px-10 lg:px-14 lg:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
