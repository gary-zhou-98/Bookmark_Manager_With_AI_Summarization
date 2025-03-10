import { Bookmark } from "./Bookmark";

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  bookmarks: Bookmark[];
}
