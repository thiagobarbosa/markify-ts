import * as cheerio from 'cheerio'
import { handleLinks } from '@/services/markdown/handlers/links'
import { processTable } from '@/services/markdown/handlers/tables'
import { processList } from '@/services/markdown/handlers/lists'

export const processElement = async (
  $: cheerio.Root,
  element: cheerio.Element,
  context: 'default' | 'table' = 'default',
  url?: string | null
): Promise<string> => {
  const $node = $(element) as cheerio.Cheerio

  if (element.type === 'text') {
    const text = $node.text().trim()
    if (!text.length || text.length < 2) return ''
    // if text already ends with a punctuation mark, don't add another one
    if (text.match(/[.!?]$/)) return text
    return text + '.'
  }

  if (element.type !== 'tag') {
    return ''
  }

  const tagName = element.name?.toLowerCase()

  switch (tagName) {
    case 'label':
      return context === 'table'
        ? '<b>' +
        (await processChildren($, $node, context, url)) +
        '</b>'
        : '**' + (await processChildren($, $node, context, url)) + '**'

    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const level = parseInt(tagName.charAt(1))
      const headingText = $node.text().trim()
      if (!headingText.length) return ''

      // check if heading has a child url
      const headingLink = $node.find('a').first()
      if (headingLink.length) {
        const linkHref = headingLink.attr('href') || ''
        return (
          '\n\n' +
          '#'.repeat(level) +
          ' [' +
          headingText +
          '](' +
          linkHref +
          ')\n'
        )
      }

      return '\n\n' + '#'.repeat(level) + ' ' + headingText + '\n'
    }

    case 'p': {
      const paragraphText = $node.text().trim()
      if (paragraphText.length) {
        return context === 'table'
          ? `<br>${paragraphText}<br>`
          : `\n${paragraphText}\n`
      }
      return ''
    }

    case 'a':
      return handleLinks($, element, url || '')

    case 'img': {
      let src = $node.attr('src')?.trim()
      if (!src?.length || src.endsWith('.svg')) return ''
      if (src.startsWith('data:image')) return ''

      if (src.startsWith('//')) {
        src = 'https:' + src
      }

      const alt =
        $node.attr('alt')?.trim() || $node.attr('title')?.trim() || 'Image'

      return `\n![${alt}](${src})`
    }

    case 'table':
      return await processTable($, $node, url)

    case 'li':
      return await processList($, $node, context, url)

    case 'strong':
    case 'b': {
      const strongText = (
        await processChildren($, $node, context, url)
      ).trim()
      if (strongText.length) {
        return context === 'table'
          ? `<b>${strongText}</b>`
          : `**${strongText}** `
      }
      return ''
    }

    case 'em':
    case 'i': {
      const emText = await processChildren($, $node, context, url)
      if (emText.trim().length) {
        return context === 'table'
          ? `<i>${emText.trim()}</i>`
          : `*${emText.trim()}* `
      }
      return ''
    }

    case 'code':
      return '`' + (await processChildren($, $node, context, url)) + '`'

    case 'pre': {
      const code = $node.find('code')
      if (code.length) {
        const language = code.attr('class')?.split('-')[1] || ''
        return '```' + language + '\n' + code.text().trim() + '\n```\n\n'
      }
      return '```\n' + $node.text().trim() + '\n```\n\n'
    }

    case 'blockquote':
      return (
        '> ' +
        (await processChildren($, $node, context, url)).replace(
          /\n/g,
          '\n> '
        ) +
        '\n'
      )

    case 'br':
      return context === 'table' ? '<br>' : '\n'

    case 'hr':
      return context === 'table' ? '<br>' : '\n---\n'

    default:
      return '\n' + (await processChildren($, $node, context, url))
  }
}

// Process all children of a node
export const processChildren = async (
  $: cheerio.Root,
  $node: cheerio.Cheerio,
  context: 'default' | 'table' = 'default',
  url?: string | null
): Promise<string> => {
  const results: string[] = []

  for (const child of $node.contents().toArray()) {
    const processedText = await processElement($, child, context, url)
    if (processedText.trim()) {
      results.push(processedText)
    }
  }

  return results.join(' ')
}