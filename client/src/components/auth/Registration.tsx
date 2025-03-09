"use client";

import Link from "next/link";
import "@/styles/auth.css";

export default function Registration() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">
            Already have an account?{" "}
            <Link href="/auth/login" className="auth-link">
              Sign in
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
              autoComplete="new-password"
              required
              className="auth-input"
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="auth-button">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
