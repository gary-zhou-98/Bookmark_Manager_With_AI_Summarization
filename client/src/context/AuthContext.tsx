"use client";

import { createContext, useContext, useCallback } from "react";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const login = useCallback(async (email: string, password: string) => {
    console.log("logging in");
  }, []);

  return (
    <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
