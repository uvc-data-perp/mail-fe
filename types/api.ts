export interface Mail {
  _id: number;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  reserved_time: string;
  sent_timestamp?: string;
  __v?: number;
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
