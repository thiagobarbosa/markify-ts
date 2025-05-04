import cheerio from 'cheerio'
import { processChildren } from '@/lib/markdown/handlers/elements'
import { getImageSource } from '@/lib/markdown/handlers/images'

/**
 * Handle links in markdown content
 * @param $ Cheerio root object
 * @param element Cheerio element node
 * @param context Context of the link (default or table)
 * @param url URL of the HTML content
 * @returns Markdown link string from the element
 */
export const handleLinks = async (
  $: cheerio.Root,
  element: cheerio.Element,
  context: 'default' | 'table' = 'default',
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

  const imgLink = await handleLinkImages($, element, href, context, url)

  // If the link contains an image, return the clickable image
  if (imgLink) {
    return imgLink
  }

  // Otherwise, process the element as a regular link
  const title = $node.attr('title')?.trim()
  const linkText = title || $node.text().trim()

  return `${linkText.length ? `[${linkText}](${href})` : href}`
}


/**
 * Handle anchor links that has images somewhere on their list of children
 * @param $ Cheerio root object
 * @param element Cheerio element node
 * @param href The href of the link
 * @param context Context of the link (default or table)
 * @param url URL of the HTML content
 */
export const handleLinkImages = async (
  $: cheerio.Root,
  element: cheerio.Element,
  href: string,
  context: 'default' | 'table' = 'default',
  url?: string | null,
): Promise<string | null> => {
  const $node = $(element)
  const $img = $node.find('img').first()

  if (!$img.length) {
    return null
  }

  const imgSrc = getImageSource($, $img[0], url)

  const imgAlt = $img.attr('alt')
  const title = $img.attr('title')
  const linkText = title || imgAlt || 'Image'

  // Remove the image from a clone to process other content
  const $nodeClone = $node.clone()
  $nodeClone.find('img').first().remove()

  // Process remaining content
  const remainingContent = await processChildren($, $nodeClone, context, url)

  // Combine image and other content
  if (remainingContent.trim().length > 2) {
    // Return both image and other content as a link
    return `\n\n![${linkText}](${imgSrc})${remainingContent}\n${href}`
  } else {
    // Only image, return linked image
    return `\n\n![${linkText}](${imgSrc})\n${href}`
  }
}