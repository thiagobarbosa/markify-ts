import * as cheerio from 'cheerio'
import { processChildren } from '@/lib/markdown/handlers/elements'

export const processList = async (
  $: cheerio.Root,
  $list: cheerio.Cheerio,
  context: 'default' | 'table' = 'default',
  url?: string | null
): Promise<string> => {
  const parts: string[] = []

  // Process each child of the list
  for (const li of $list) {
    const $li = $(li)

    const itemText = await processChildren($, $li, context, url)

    if (itemText.trim().length) {
      // Add prefix only if there's no image or heading inside the list item
      const addPrefix = !$li.find('img').length && !$li.find('h1, h2, h3, h4, h5, h6').length

      if (context === 'table') {
        parts.push('<br><li>' + (addPrefix ? '* ' : '') + itemText.trim() + '</li>')
      } else {
        parts.push('\n' + (addPrefix ? '* ' : '') + itemText.trim())
      }
    }
  }

  return parts.join('\n')
}
