export interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  status: string;
  sentTimestamp?: string;
  v?: number;
  reservedTime: String;
  type?: "prev" | "next";
}
export interface ApiStructure {
  articles: Article[];
  status: string;
  totalResults: number;
}

export interface Article {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: { id: string; name: string };
  title: string;
  url: string;
  urlToImage: string;
}
