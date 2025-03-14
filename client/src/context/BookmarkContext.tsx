"use client";

import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";
import { Bookmark } from "@/models/Bookmark";
import { fetchAllBookmarks } from "@/api/bookmarkAPI";
import { useAuth } from "@/context/AuthContext";

interface BookmarkContextType {
  data: Bookmark[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  // const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { data } = useSWR(["/bookmarks", user?.id], fetchAllBookmarks);

  // useEffect(() => {
  //   if (!data) {
  //     return;
  //   }

  //   if (data.length != bookmarks.length) {
  //     setBookmarks(data);
  //   }

  //   for (let i = 0; i < data.length; i++) {
  //     if (!bookmarks[i].equals(data[i])) {
  //       setBookmarks(data);
  //       break;
  //     }
  //   }
  // }, [data, bookmarks, setBookmarks]);

  return (
    <BookmarkContext.Provider value={{ data }}>
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
