"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "@/styles/auth.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login, user, accessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (user && accessToken) {
      router.push(`/home/${user.id}`);
    }
  }, [user, accessToken, router]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-start mb-4">
            <Link href="/auth/forgot-password" className="auth-link text-sm">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={!email || !password}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
