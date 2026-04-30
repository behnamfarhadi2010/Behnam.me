import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-20 text-center space-y-5">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="font-serif text-5xl">Lost in the stacks</h1>
      <p className="text-foreground/70">
        The page you&apos;re looking for isn&apos;t here. Maybe try heading back home and starting again.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-[hsl(348,70%,55%)] hover:bg-[hsl(348,70%,48%)] text-white px-4 py-2 text-sm font-medium transition-colors"
      >
        Take me home
      </Link>
    </div>
  );
}
