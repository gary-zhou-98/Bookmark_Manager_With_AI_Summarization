"use client";

import { User } from "@/models/User";
import { createContext, useState, useContext, useCallback } from "react";
import { loginRequest, registerRequest, logoutRequest } from "@/api/authAPI";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginRequest(email, password).then((response) => {
          setUser(response.user);
        });
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error);
      }
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    if (!user) {
      alert("No user to logout");
      return;
    }
    try {
      await logoutRequest().then(() => {
        setUser(null);
      });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed: " + error);
    }
  }, [user]);

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        await registerRequest(email, password).then((response) => {
          setUser(response.user);
        });
      } catch (error) {
        console.error("Register failed:", error);
        alert("Register failed: " + error);
      }
    },
    [setUser]
  );

  return (
    <AuthContext.Provider value={{ login, logout, register, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
