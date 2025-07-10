import cheerio from 'cheerio'
import { MIN_TEXT_LENGTH } from '@/lib/markdown/handlers/elements'

/**
 * Trims excessive breaks from a markdown string.
 * Operations performed:
 * - Replace any occurrence of 3 or more line breaks with only 2
 * - Remove any occurrence of more than 3 spaces by only 1, except if it's a line break
 * - Remove 2 sequential forward slashes
 * - Remove line breaks from the start
 * - Remove line breaks from the end
 * - Trim the whole string
 * @param markdown The markdown string to trim
 * @returns The trimmed markdown string
 */
export const cleanSpaces = (markdown: string): string => {
  return (
    markdown
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {3,}/g, ' ')
      .replace(/^\n+/, '')
      .replace(/\n+$/, '')
      .trim()
  )
}

export const preProcessingRemovals = (
  $: cheerio.Root,
  selectorsToIgnore?: string[],
  ignoreHiddenElements?: boolean
) => {
  // remove invisible elements and 'Skip to main content' accessibility link
  if (ignoreHiddenElements) {
    $('*').each((_, el) => {
      const $node = $(el) as cheerio.Cheerio
      if (($node.text() === 'Skip to main content') || !isVisible($node)) {
        $node.remove()
      }
    })
  }

  // remove elements based on selectors
  if (selectorsToIgnore?.length) {
    for (const selector of selectorsToIgnore) {
      if ($(selector).length) {
        $(selector).remove()
      }
    }
  }

  return $
}

const isVisible = (el: cheerio.Cheerio): boolean => {
  const style = el.attr('style')
  const ariaHidden = el.attr('aria-hidden')

  if (!style && !ariaHidden) return true

  const hasHiddenStyle = style?.includes('display: none') || style?.includes('visibility: hidden')
  const hasAriaHidden = ariaHidden === 'true'

  return !hasHiddenStyle && !hasAriaHidden
}


/**
 * Get all the text content from a node and its children
 * @param $ Cheerio root object
 * @param element Cheerio element node
 * @returns Array of text strings
 */
export const getTextsFromNode = ($: cheerio.Root, element: cheerio.Element): string[] => {
  const texts: string[] = []

  // If the node is a text node, return its text
  if (element.type === 'text' && $(element).text().trim().length > MIN_TEXT_LENGTH) {
    texts.push($(element).text().trim())
    return texts
  }

  // If the node is an element, iterate through its children
  if (element.type === 'tag') {
    $(element).contents().each((_, child) => {
      texts.push(...getTextsFromNode($, child))
    })
  }

  return texts
}