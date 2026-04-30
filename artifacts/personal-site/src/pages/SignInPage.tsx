<<<<<<< HEAD
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signIn(username, password)) {
      setLocation("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

=======
import { SignIn } from "@clerk/react";
import { Link } from "wouter";

export default function SignInPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
>>>>>>> ef57f6830cf4bd7deb77e1ac4909868f2c238893
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
<<<<<<< HEAD
          
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <Button type="submit" className="w-full bg-[hsl(348,70%,50%)] hover:bg-[hsl(348,70%,40%)]">
              Sign In
            </Button>
          </form>
=======
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            fallbackRedirectUrl={`${basePath}/dashboard`}
          />
>>>>>>> ef57f6830cf4bd7deb77e1ac4909868f2c238893
        </div>
      </div>
    </div>
  );
}
