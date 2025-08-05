import * as cheerio from 'cheerio'
import { processChildren } from '@/lib/markdown/handlers/elements'

export const processList = async (
  $: cheerio.Root,
  $list: cheerio.Cheerio,
  context: 'default' | 'table' = 'default',
  url?: string | null
): Promise<string> => {
  const parts: string[] = []
  const isOrderedList = $list.prop('tagName')?.toLowerCase() === 'ol'
  let counter = 1

  // Process each child of the list
  for (const li of $list.children('li')) {
    const $li = $(li)

    const itemText = await processChildren($, $li, context, url)

    if (itemText.trim().length) {
      // Add prefix only if there's no image or heading inside the list item
      const addPrefix = !$li.find('img').length && !$li.find('h1, h2, h3, h4, h5, h6').length

      const prefix = addPrefix ? (isOrderedList ? `${counter}. ` : '* ') : ''

      if (context === 'table') {
        parts.push('<br><li>' + prefix + itemText.trim() + '</li>')
      } else {
        const content = itemText.trim()
        parts.push(prefix + content)
      }
      
      if (addPrefix && isOrderedList) {
        counter++
      }
    }
  }

  return parts.length > 0 ? '\n\n' + parts.join('\n') : ''
}
