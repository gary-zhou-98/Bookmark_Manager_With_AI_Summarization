"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Bookmark } from "@/models/Bookmark";
import { fetchAllBookmarks } from "@/api/bookmarkAPI";

interface BookmarkContextType {
  bookmarks: Bookmark[];
  fetchBookmarks: () => void;
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

  const fetchBookmarks = useCallback(async () => {
    try {
      const bookmarks = await fetchAllBookmarks();
      setBookmarks(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }, [setBookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, fetchBookmarks }}>
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
