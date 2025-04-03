import * as cheerio from 'cheerio'
import { processChildren } from '@/lib/markdown/handlers/elements'

export const processList = async (
  $: cheerio.Root,
  $list: cheerio.Cheerio,
  context: 'default' | 'table' = 'default',
  url?: string | null
): Promise<string> => {
  const parts: string[] = []
  const children = $list.children().toArray()

  for (const li of children) {
    const $li = $(li)

    const itemText = await processChildren($, $li, context, url)

    if (itemText.trim().length) {
      if (context === 'table') {
        parts.push(`<li>${itemText.trim()}</li>`)
      } else {
        parts.push(`\n* ${itemText.trim()}`)
      }
    }
  }

  return parts.join('\n')
}
