"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Bookmark } from "@/models/Bookmark";

interface BookmarkContextType {
  bookmarks: Bookmark[];
  updateBookmarks: (bookmarks: Bookmark[]) => void;
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

  return (
    <BookmarkContext.Provider value={{ bookmarks, updateBookmarks }}>
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
