"use client";

import Link from "next/link";
import "@/styles/auth.css";

export default function Login() {
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

        <form className="auth-form">
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
            />
          </div>

          <div className="flex items-center justify-start mb-4">
            <Link href="/auth/forgot-password" className="auth-link text-sm">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
