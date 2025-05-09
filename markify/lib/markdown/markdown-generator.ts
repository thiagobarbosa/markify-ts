import * as cheerio from 'cheerio'
import { getHTML } from '@/lib/html/html-fetcher'
import { cleanSpaces, preProcessingRemovals } from '@/lib/utils'
import { processChildren } from '@/lib/markdown/handlers/elements'
import assert from 'node:assert'

/**
 * Generates markdown from HTML content.
 * @param html The HTML content to convert to markdown
 * @param url The URL of the HTML content; used for relative links
 * @param fetchOptions Options to pass to the fetch function
 * @param selectorsToIgnore An array of selectors to ignore when processing the HTML
 * @returns The markdown content generated from the HTML
 * @throws Error if no HTML content is provided
 */
export const generateMarkdown = async ({ html, url, ignoreSelectors, ignoreHiddenElements, fetchOptions }:
  {
    html?: string | null,
    url?: string | null,
    ignoreSelectors?: string[],
    ignoreHiddenElements?: boolean,
    fetchOptions?: RequestInit
  }
): Promise<string> => {
  if (!html) {
    assert(url, 'Either html or url must be provided')
    html = await getHTML(url, fetchOptions)
  }

  let $ = cheerio.load(html)
  $ = preProcessingRemovals($, ignoreSelectors, ignoreHiddenElements)

  const promise = processChildren($, $('body'), 'default', url)
  return await promise.then((markdown) => cleanSpaces(markdown))
}

