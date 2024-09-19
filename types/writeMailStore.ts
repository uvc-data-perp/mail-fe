export interface MailContents {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  periodType?: string;
  selectedTags?: string[];
}

export interface MailMessage {
  contents: MailContents;
}
