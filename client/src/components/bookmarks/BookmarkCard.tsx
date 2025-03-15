"use client";

import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Bookmark } from "@/models/Bookmark";
import "@/styles/bookmarkCard.css";

export interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete?: (bookmarkId: string) => Promise<void>;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onDelete,
}: BookmarkCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) {
      onDelete(bookmark.id);
    }
  };

  return (
    <div className="bookmark-card group">
      <Link href={bookmark.url} target="_blank" className="block">
        <h2 className="bookmark-title group-hover:text-indigo-400">
          {bookmark.title}
        </h2>
        <p className="bookmark-url group-hover:text-indigo-400/70">
          {bookmark.url}
        </p>
      </Link>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="delete-button"
          aria-label="Delete bookmark"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
