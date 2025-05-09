import cheerio from 'cheerio'
import { getTextsFromNode } from '@/lib/utils'

/**
 * Handle links in markdown content
 * @param $ Cheerio root object
 * @param element Cheerio element node
 * @param url URL of the HTML content
 * @returns Markdown link string from the element
 */
export const handleLinks = async (
  $: cheerio.Root,
  element: cheerio.Element,
  url?: string | null
): Promise<string | null> => {
  let href = $(element).attr('href')

  if (!href || !href.length || href.startsWith('javascript')) return null

  // Process href
  if (href.startsWith('#') && url) {
    href = url + href
  }

  if (href.startsWith('/')) {
    const targetDomain = url ? new URL(url).origin : ''
    href = targetDomain + href
  }

  const $node = $(element)

  // Otherwise, process the element as a regular link
  const title = $node.attr('title')?.trim()
  const ariaLabel = $node.attr('aria-label')?.trim()
  const linkText = title || ariaLabel || !$node.children().length ? $node.text().trim() : null

  return linkText?.length ? '\n' + '[' + linkText + '](' + href + ')' + '\n' :
    '\n\n' + getTextsFromNode($, $node[0]).join('\n* ').trim() + '\n' + href + '\n'
}

