"use client";

import useSWR from "swr";
import { getBookmarkRequest } from "@/api/bookmarkAPI";
import { LoadingState } from "@/components/common/LoadingState";
import { useParams } from "next/navigation";
import { CalendarIcon, SparklesIcon } from "@heroicons/react/24/outline";
import "@/styles/bookmarkDetails.css";

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
    return <LoadingState text="Loading bookmark details..." />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!data) {
    return <div>No data found</div>;
  }

  const bookmark = data.bookmark;

  return (
    <div className="bookmark-details-container">
      <div className="bookmark-details-card">
        <h1 className="bookmark-title">{bookmark.title}</h1>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bookmark-url"
        >
          {bookmark.url}
        </a>

        <div className="bookmark-metadata">
          <CalendarIcon className="w-5 h-5" />
          <span>Saved on {formatDate(bookmark.createdAt)}</span>
        </div>

        <div className="bookmark-summary">
          <div className="summary-title">
            <SparklesIcon className="w-5 h-5" />
            <span>AI Summary</span>
          </div>
          <p className="summary-content">
            {bookmark.summary || "No summary available."}
          </p>
        </div>
      </div>
    </div>
  );
}
