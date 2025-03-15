"use client";

import "@/styles/homePage.css";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Bookmark } from "@/models/Bookmark";
import { fetchAllBookmarks } from "@/api/bookmarkAPI";
import useSWR from "swr";
import { useBookmark } from "@/context/BookmarkContext";
import { useEffect, useState } from "react";
import { AddBookmarkModal } from "@/components/bookmarks/AddBookmarkModal";
import { BookmarkCard } from "@/components/bookmarks/BookmarkCard";

export default function HomePage() {
  const { data, error, isLoading } = useSWR("/bookmarks", fetchAllBookmarks);
  const { bookmarks, updateBookmarks, addNewBookmark } = useBookmark();
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);

  useEffect(() => {
    if (data) {
      updateBookmarks(data.bookmarks);
    }
  }, [data, updateBookmarks]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">My Bookmarks</h1>
        <p className="home-subtitle">
          Manage and organize your favorite websites
        </p>
      </div>

      <div className="bookmarks-grid">
        {bookmarks.map((bookmark: Bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={() => {}}
          />
        ))}
      </div>

      <button
        className="add-bookmark-button"
        aria-label="Add new bookmark"
        onClick={(e) => {
          e.preventDefault();
          setShowAddBookmarkModal(true);
        }}
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      <AddBookmarkModal
        isOpen={showAddBookmarkModal}
        onClose={() => setShowAddBookmarkModal(false)}
        onSubmitForm={addNewBookmark}
      />
    </div>
  );
}
