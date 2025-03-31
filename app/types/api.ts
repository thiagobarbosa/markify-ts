export interface MarkdownResponse {
  markdown: string;
  originalUrl: string;
  title?: string;
  error?: string;
}

export interface MarkdownRequest {
  url: string;
}