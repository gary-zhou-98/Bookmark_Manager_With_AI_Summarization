"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Bookmark } from "@/models/Bookmark";
import { addBookmarkRequest, deleteBookmarkRequest } from "@/api/bookmarkAPI";

interface BookmarkContextType {
  bookmarks: Bookmark[];
  updateBookmarks: (bookmarks: Bookmark[]) => void;
  addNewBookmark: (title: string, url: string) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
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
      const data = await addBookmarkRequest(title, url);
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
      alert("Error adding bookmark: " + error);
    }
  }, []);

  const deleteBookmark = useCallback(async (id: string) => {
    try {
      await deleteBookmarkRequest(id).then(() => {
        setBookmarks((prevBookmarks) =>
          prevBookmarks.filter((bookmark) => bookmark.id !== id)
        );
      });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      alert("Error deleting bookmark: " + error);
    }
  }, []);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, updateBookmarks, addNewBookmark, deleteBookmark }}
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
