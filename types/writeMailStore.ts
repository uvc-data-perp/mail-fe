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
  expiredTimestamp?: String;
  days?: Array<number | boolean>;
  sendTime?: String;
}

export interface MailMessage {
  contents: MailContents;
}
