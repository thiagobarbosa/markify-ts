import { MarkdownRequest, MarkdownResponse } from "../types/api";

export async function getMarkdownFromUrl(url: string): Promise<MarkdownResponse> {
  try {
    // In a real implementation, this would call your actual API
    // For now, it returns mock data
    return mockApiCall(url);
  } catch (error) {
    return {
      markdown: "",
      originalUrl: url,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Mock API call that simulates the behavior of your actual API
async function mockApiCall(url: string): Promise<MarkdownResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    throw new Error("Invalid URL");
  }
  
  // Return mock response
  return {
    markdown: `# Sample Markdown from ${url}

This is a sample markdown generated from ${url}.

## Features

- Clean formatting
- Preserves headings
- Maintains links

## Code Example

\`\`\`javascript
function example() {
  console.log("Hello world!");
}
\`\`\`

## Table Example

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`,
    originalUrl: url,
    title: "Sample Page",
  };
}