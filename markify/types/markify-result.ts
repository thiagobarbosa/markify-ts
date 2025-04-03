/**
 * Result of the HTML to Markdown transformation
 */
export interface MarkifyResult {
  /** The resulting Markdown content */
  markdown: string;
  /** The source HTML used for transformation */
  sourceHtml: string;
  /** Timestamp of when the transformation was completed */
  timestamp: number;
}