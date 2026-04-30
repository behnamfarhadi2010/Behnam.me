import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  StickyNote,
  Hammer,
  User,
  ArrowLeft,
} from "lucide-react";

const ADMIN_NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/posts", label: "Posts", icon: FileText },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/projects", label: "Projects", icon: Hammer },
  { to: "/about", label: "About", icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loc] = useLocation();
  const { signOut } = useAuth();
  // useLocation inside the nested router returns paths relative to /dashboard,
  // e.g. "/" for /dashboard, "/posts" for /dashboard/posts.
  return (
    <div className="min-h-screen bg-[hsl(40,30%,95%)]">
      <header className="border-b border-[hsl(40,20%,85%)] bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="~/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[hsl(348,70%,55%)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to site</span>
            </Link>
            <div className="hidden sm:block h-6 w-px bg-[hsl(40,20%,80%)]" />
            <span className="font-serif text-lg">
              Studio
              <span className="ml-1 text-[hsl(348,70%,55%)]">.</span>
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => signOut()} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
        <nav className="mx-auto max-w-7xl px-2 sm:px-6 -mb-px overflow-x-auto">
          <ul className="flex gap-1 text-sm">
            {ADMIN_NAV.map((n) => {
              const active = n.exact
                ? loc === n.to
                : loc === n.to || loc.startsWith(n.to + "/");
              const Icon = n.icon;
              return (
                <li key={n.to}>
                  <Link
                    href={n.to}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      active
                        ? "border-[hsl(348,70%,55%)] text-[hsl(348,70%,40%)] font-medium"
                        : "border-transparent text-foreground/70 hover:text-foreground hover:border-[hsl(40,20%,80%)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
