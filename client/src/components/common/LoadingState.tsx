"use client";

import "@/styles/loadingState.css";

interface LoadingStateProps {
  text?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  text = "Loading...",
}) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
};
