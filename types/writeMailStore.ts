export interface MailContents {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  selectedTags: string[];
  periodType?: string;
  reservedDate?: Date;
  reservedTimestamp?: String;
  expiryDate?: Date;
  days?: Array<number>;
}

export interface MailMessage {
  contents: MailContents;
}
