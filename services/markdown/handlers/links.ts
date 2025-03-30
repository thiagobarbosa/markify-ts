/**
 * Handle links in markdown content
 * @param $ Cheerio root object
 * @param node Cheerio element node
 * @param url URL of the HTML content
 * @returns Markdown link string from the node
 */
export const handleLinks = (
  $: cheerio.Root,
  node: cheerio.Element,
  url: string,
): string => {
  let href = $(node).attr('href')

  if (!href || !href.length || href.startsWith('javascript')) return ''

  // check if child is an image
  if ($(node).find('img').length) {
    return ''
  }

  const title = $(node).attr('title')

  if (href.startsWith('#')) {
    href = url + href
  }

  if (href.startsWith('/')) {
    const targetDomain = url ? new URL(url).origin : ''
    href = targetDomain + href
  }

  const linkText = title || $(node).text().trim()

  return `${linkText ? `[${linkText}](${href})` : href}`
}
