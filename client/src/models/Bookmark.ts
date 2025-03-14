export class Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  faviconUrl: string | null;
  summary: string | null;

  constructor(
    id: string,
    title: string,
    url: string,
    createdAt: Date,
    faviconUrl: string | null,
    summary: string | null
  ) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.createdAt = createdAt;
    this.faviconUrl = faviconUrl;
    this.summary = summary;
  }

  setFaviconUrl(faviconUrl: string | null) {
    this.faviconUrl = faviconUrl;
  }

  setSummary(summary: string | null) {
    this.summary = summary;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      url: this.url,
      createdAt: this.createdAt,
      faviconUrl: this.faviconUrl,
      summary: this.summary,
    };
  }
}
