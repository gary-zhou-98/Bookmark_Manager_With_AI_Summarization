import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { AuthProvider } from "@/context/AuthContext";
import { BookmarkProvider } from "@/context/BookmarkContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description: "A modern bookmark manager with AI-powered summarization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <BookmarkProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Header />
            <main className="main-container">{children}</main>
          </body>
        </BookmarkProvider>
      </AuthProvider>
    </html>
  );
}
