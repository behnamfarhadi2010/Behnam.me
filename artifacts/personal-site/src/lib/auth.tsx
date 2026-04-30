import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { setAuthTokenGetter } from "@workspace/api-client-react";

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  signIn: () => false,
  signOut: () => {},
});

const ADMIN_USERNAME = "admin_master";
const ADMIN_PASSWORD = "ComplexPassword!@#2026";
const MOCK_TOKEN = "admin_super_secret_token_xyz_890";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === MOCK_TOKEN) {
      setIsSignedIn(true);
      setAuthTokenGetter(() => MOCK_TOKEN);
    }
    setIsLoaded(true);
  }, []);

  const signIn = (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_token", MOCK_TOKEN);
      setIsSignedIn(true);
      setAuthTokenGetter(() => MOCK_TOKEN);
      return true;
    }
    return false;
  };

  const signOut = () => {
    localStorage.removeItem("admin_token");
    setIsSignedIn(false);
    setAuthTokenGetter(() => null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
