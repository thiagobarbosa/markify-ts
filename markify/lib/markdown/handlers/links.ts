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
  const ariaLabel = $node.attr('aria-label')?.trim()
  const linkText = title || ariaLabel || $node.text().trim()

  return linkText.length ? `\n[${linkText}](${href})` : '\n' + href
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

  const imgAlt = $img.attr('alt')?.trim()
  const title = $img.attr('title')?.trim()
  const ariaLabel = $img.attr('aria-label')?.trim()
  const linkText = title || imgAlt || ariaLabel || 'Image'

  // Remove the image from a clone to process other content
  const $nodeClone = $node.clone()
  $nodeClone.find('img').first().remove()

  // Process remaining content
  const remainingContent = await processChildren($, $nodeClone, context, url)
  // Replace any double '\n' with a single '\n'
  const cleanedRemainingContent = remainingContent.replace(/\n{2,}/g, '\n')

  // Combine image and other content
  if (cleanedRemainingContent.trim().length > 2) {
    // Return both image and other content as a link
    return `\n\n![${linkText}](${imgSrc})${cleanedRemainingContent}\n${href}\n---\n`
  } else {
    // Only image, return linked image
    return `\n\n![${linkText}](${imgSrc})\n${href}\n---\n`
  }
}