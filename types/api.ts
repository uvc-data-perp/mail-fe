export interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  status: string;
  sentTimestamp?: string;
  sentDate?: Date;
  v?: number;
  reservedTime: String;
  reservedDate?: Date;
  expiredDate?: Date;
  type?: "prev" | "next";
}
export interface ApiStructure {
  articles: Article[];
  status: string;
  totalResults: number;
}

export interface ReservedMail extends Mail {
  groupId: string;
  id: string;
  emailContents: string[];
  expired_timestamp: string;
  expiredDate?: Date;
  sendingDays: number[];
  status: string;
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
