"use client";

import Link from "next/link";
import "@/styles/auth.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Registration() {
  const { register, user, accessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register(email, password);
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
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">
            Already have an account?{" "}
            <Link href="/auth/login" className="auth-link">
              Login
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
              autoComplete="new-password"
              required
              className="auth-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={!email || !password}
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
