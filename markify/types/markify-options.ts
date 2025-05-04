/**
 * Configuration options for the HTML to Markdown transformation
 */
export interface MarkifyOptions {
  /** URL to fetch HTML from (required if htmlContent not provided) */
  url?: string;
  /** Raw HTML content (required if url not provided) */
  htmlContent?: string;
  /** Custom fetch options when retrieving URL */
  fetchOptions?: RequestInit;
  /** Selectors to ignore when processing the HTML */
  ignoreSelectors?: string[];
  /** Ignore hidden elements (e.g., display: none) */
  ignoreHiddenElements?: boolean;
}