import { Bookmark } from "./Bookmark";

export class User {
  id: string;
  email: string;
  createdAt: Date;
  bookmarks: Bookmark[];

  constructor(
    id: string,
    email: string,
    createdAt: Date,
    bookmarks: Bookmark[] | null
  ) {
    this.id = id;
    this.email = email;
    this.createdAt = createdAt;
    this.bookmarks = bookmarks || [];
  }

  setBookmarks(bookmarks: Bookmark[]) {
    this.bookmarks = bookmarks;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      bookmarks: this.bookmarks.map((bookmark) => bookmark.toJSON()),
    };
  }
}
