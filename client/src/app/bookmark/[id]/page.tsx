"use client";

import useSWR from "swr";
import { getBookmarkRequest } from "@/api/bookmarkAPI";
import { LoadingState } from "@/components/common/LoadingState";
import { useParams } from "next/navigation";

export default function BookmarkPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useSWR(
    [`/bookmark/${id}`, id],
    getBookmarkRequest
  );

  if (error) {
    alert("Error fetching bookmarks: " + error);
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <LoadingState text="Loading bookmarks..." />;
  }

  return <div className="home-container"></div>;
}
