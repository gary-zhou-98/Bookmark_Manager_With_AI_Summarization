"use client";

import { User } from "@/models/User";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { loginRequest, registerRequest } from "@/api/authAPI";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  user: User | null;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (user && accessToken) {
      setUser(JSON.parse(user));
      setAccessToken(accessToken);
    }
    console.log(user, accessToken);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginRequest(email, password).then((response) => {
          setUser(response.user);
          setAccessToken(response.access_token);
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("accessToken", response.access_token);
        });
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error);
      }
    },
    [setUser, setAccessToken]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    setAccessToken(null);
    alert("Logged out successfully");
  }, [setUser, setAccessToken]);

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        await registerRequest(email, password).then((response) => {
          setUser(response.user);
          setAccessToken(response.access_token);
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("accessToken", response.access_token);
        });
      } catch (error) {
        console.error("Register failed:", error);
        alert("Register failed: " + error);
      }
    },
    [setUser, setAccessToken]
  );

  return (
    <AuthContext.Provider
      value={{ login, logout, register, user, accessToken }}
    >
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
