import * as cheerio from 'cheerio'
import { getHTML } from '@/services/html/html-fetcher'
import { cleanSpaces } from '@/services/utils'
import { processElement } from '@/services/markdown/handlers/elements'
import assert from 'node:assert'

/**
 * Generates markdown from HTML content.
 * @param html The HTML content to convert to markdown
 * @param url The URL of the HTML content; used for relative links
 * @param fetchOptions Options to pass to the fetch function
 * @returns The markdown content generated from the HTML
 * @throws Error if no HTML content is provided
 */
export const generateMarkdown = async (
  html?: string | null,
  url?: string | null,
  fetchOptions?: RequestInit
): Promise<string> => {
  if (!html) {
    assert(url, 'Either html or url must be provided')
    html = await getHTML(url, fetchOptions)
  }

  const $ = cheerio.load(html)
  $('script, noscript, style, svg, header, footer, head, nav, iframe, [role="contentinfo"]').remove()

  // remove items that have role="alert" or "dialog"
  $('[role="alert"], [role="dialog"]').remove()

  const promise = processElement($, $('body')[0], 'default', url)
  return await promise.then((markdown) => cleanSpaces(markdown))
}

