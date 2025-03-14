"use client";

import Link from "next/link";
import "@/styles/homePage.css";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Bookmark } from "@/models/Bookmark";
import { useBookmark } from "@/context/BookmarkContext";

// Temporary mock data
const mockBookmarks = [
  new Bookmark(
    "1",
    "Understanding React Server Components",
    "https://nextjs.org/docs/getting-started/react-essentials#server-components",
    new Date(),
    null,
    null
  ),
  // Add more mock items as needed
];

export default function HomePage() {
  const { data } = useBookmark();

  const bookmarks = data ? mockBookmarks.concat(data) : mockBookmarks;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">My Bookmarks</h1>
        <p className="home-subtitle">
          Manage and organize your favorite websites
        </p>
      </div>

      <div className="bookmarks-grid">
        {bookmarks.map(
          (bookmark) => (
            console.log(bookmark),
            (
              <Link
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                className="bookmark-card group"
              >
                <h2 className="bookmark-title group-hover:text-indigo-400">
                  {bookmark.title}
                </h2>
                <p className="bookmark-url group-hover:text-indigo-400/70">
                  {bookmark.url}
                </p>
              </Link>
            )
          )
        )}
      </div>

      <button className="add-bookmark-button" aria-label="Add new bookmark">
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
