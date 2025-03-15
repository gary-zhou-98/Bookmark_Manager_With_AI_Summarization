"use client";

import { BookmarkIcon } from "@heroicons/react/24/outline";
import "@/styles/emptyBookmarks.css";

export const EmptyBookmarks = () => {
  return (
    <div className="empty-state-container">
      <BookmarkIcon className="empty-state-icon" />
      <h3 className="empty-state-title">No bookmarks yet</h3>
      <p className="empty-state-description">
        Click the + button above to add your first bookmark. Save interesting
        articles, videos, and websites to read later.
      </p>
    </div>
  );
};
