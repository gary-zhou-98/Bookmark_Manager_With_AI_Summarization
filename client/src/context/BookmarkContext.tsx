"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Bookmark } from "@/models/Bookmark";
import { addBookmark } from "@/api/bookmarkAPI";

interface BookmarkContextType {
  bookmarks: Bookmark[];
  updateBookmarks: (bookmarks: Bookmark[]) => void;
  addNewBookmark: (title: string, url: string) => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const updateBookmarks = useCallback(
    (bookmarks: Bookmark[]) => {
      setBookmarks(bookmarks);
    },
    [setBookmarks]
  );

  const addNewBookmark = useCallback(async (title: string, url: string) => {
    try {
      const data = await addBookmark(title, url);
      if (data) {
        const newBookmark = new Bookmark(
          data.bookmark.id,
          data.bookmark.title,
          data.bookmark.url,
          data.bookmark.createdAt,
          data.bookmark.faviconUrl,
          data.bookmark.summary
        );
        setBookmarks((prevBookmarks) => [...prevBookmarks, newBookmark]);
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  }, []);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, updateBookmarks, addNewBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }
  return context;
};
