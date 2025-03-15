"use client";

import "@/styles/homePage.css";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Bookmark } from "@/models/Bookmark";
import { fetchAllBookmarks } from "@/api/bookmarkAPI";
import { useBookmark } from "@/context/BookmarkContext";
import { AddBookmarkModal } from "@/components/bookmarks/AddBookmarkModal";
import { BookmarkCard } from "@/components/bookmarks/BookmarkCard";
import { LoadingState } from "@/components/common/LoadingState";

export default function HomePage() {
  const { data, error, isLoading } = useSWR("/bookmarks", fetchAllBookmarks);
  const { bookmarks, updateBookmarks, addNewBookmark, deleteBookmark } =
    useBookmark();
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);

  useEffect(() => {
    if (data) {
      updateBookmarks(data.bookmarks);
    }
  }, [data, updateBookmarks]);

  if (error) {
    alert("Error fetching bookmarks: " + error);
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <LoadingState text="Loading bookmarks..." />;
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
            onDelete={deleteBookmark}
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
