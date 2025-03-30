import { getHTML } from './html/html-fetcher'
import { generateMarkdown } from './markdown/markdown-generator'
import { MarkifyOptions } from '@/types/markify-options'
import { MarkifyResult } from '@/types/markify-result'

/**
 * Transforms HTML content into Markdown format
 */
export const markify = async (options: MarkifyOptions): Promise<MarkifyResult> => {
  let html: string

  if (options.url && !options.htmlContent) {
    // Fetch HTML from URL
    html = await getHTML(options.url, options.fetchOptions)
  } else if (options.htmlContent) {
    // Use provided HTML content
    html = options.htmlContent
  } else {
    throw new Error('Either url or htmlContent must be provided')
  }

  // Generate Markdown from HTML
  const markdown = await generateMarkdown(html)

  return {
    markdown,
    sourceHtml: html,
    timestamp: Date.now()
  }
}