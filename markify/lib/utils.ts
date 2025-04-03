import cheerio from 'cheerio'

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
      .replace(/\\/g, '')
      .replace(/^\n+/, '')
      .replace(/\n+$/, '')
      .trim()
  )
}

export const preProcessingRemovals = (
  $: cheerio.Root,
  selectorsToIgnore?: string[]
) => {
  // remove globally unwanted elements
  $('script, noscript, style').remove()

  // remove invisible elements
  $('*').each((_, el) => {
    if (!isVisible($(el))) {
      $(el).remove()
    }
  })

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

const isVisible = (el: any): boolean => {
  const style = el.css(['display', 'visibility'])
  return style?.display !== 'none' && style?.visibility !== 'hidden'
}
