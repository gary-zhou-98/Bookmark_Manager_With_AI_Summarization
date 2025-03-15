"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "@/styles/modal.css";

export interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitForm: (title: string, url: string) => void;
}

export const AddBookmarkModal = ({
  isOpen,
  onClose,
  onSubmitForm,
}: AddBookmarkModalProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Set up Modal's app element on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement("body");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitForm(title, url);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setUrl("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      contentLabel="Add Bookmark Modal"
    >
      <div className="modal-header">
        <h2 className="modal-title">Add New Bookmark</h2>
        <button
          onClick={handleClose}
          className="modal-close"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter bookmark title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="form-input"
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleClose} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Add Bookmark
          </button>
        </div>
      </form>
    </Modal>
  );
};
