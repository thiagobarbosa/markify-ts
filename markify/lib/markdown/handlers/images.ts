import cheerio from 'cheerio'

/**
 * Handles image elements in the HTML and converts them to Markdown format.
 * @param $ Cheerio root object
 * @param element Cheerio element node
 * @param url URL of the HTML content
 */
export const handleImages = (
  $: cheerio.Root,
  element: cheerio.Element,
  url?: string | null
): string | null => {
  const imgSrc = getImageSource($, element, url)

  if (!imgSrc) return null

  const imgAlt = $(element).attr('alt')?.trim() || $(element).attr('title')?.trim() || 'Image'

  return `\n![${imgAlt}](${imgSrc})\n`
}

/**
 * Extracts the image source URL from the given Cheerio element.
 * @param $ Cheerio root object
 * @param element Cheerio element node
 * @param url URL of the HTML content
 */
export const getImageSource = (
  $: cheerio.Root,
  element: cheerio.Element,
  url?: string | null
): string | null => {
  let src = $(element).attr('src')?.trim()
  if (!src?.length || src.endsWith('.svg') || src.startsWith('data:image')) return null

  if (src.startsWith('/') && url) {
    src = new URL(src, url).href
  }

  if (src.startsWith('//')) {
    src = 'https:' + src
  }

  return src
}