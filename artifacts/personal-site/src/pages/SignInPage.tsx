import { SignIn } from "@clerk/react";
import { Link } from "wouter";

export default function SignInPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(40,33%,97%)]">
      <header className="px-6 py-4">
        <Link href="/" className="font-serif text-lg hover:text-[hsl(348,70%,50%)] transition-colors">
          ← Back to site
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage posts, notes, and projects.
            </p>
          </div>
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            fallbackRedirectUrl={`${basePath}/dashboard`}
          />
        </div>
      </div>
    </div>
  );
}
