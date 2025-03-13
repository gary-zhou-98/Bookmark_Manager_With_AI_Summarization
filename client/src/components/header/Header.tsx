"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/header.css";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const loginOrOutButton = user ? (
    <button className="nav-link" onClick={logout}>
      Logout
    </button>
  ) : (
    <Link
      href="/auth/login"
      className={`nav-link ${
        pathname === "/auth/login" ? "nav-link-active" : ""
      }`}
    >
      Login
    </Link>
  );
  return (
    <header className="header-container">
      <div className="header-content">
        <Link href="/" className="header-logo">
          Bookmark Manager
        </Link>

        <nav className="header-nav">
          <Link
            href="/bookmarks"
            className={`nav-link ${
              pathname === "/bookmarks" ? "nav-link-active" : ""
            }`}
          >
            My Bookmarks
          </Link>
          {loginOrOutButton}
          {!user && (
            <Link
              href="/auth/register"
              className={`nav-link ${
                pathname === "/auth/register" ? "nav-link-active" : ""
              }`}
            >
              Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
