import cheerio from 'cheerio'
import { handleLinks } from '@/lib/markdown/handlers/links'
import { handleImages } from '@/lib/markdown/handlers/images'
import { processTable } from '@/lib/markdown/handlers/tables'
import { processList } from '@/lib/markdown/handlers/lists'

export const processElement = async (
  $: cheerio.Root,
  element: cheerio.Element,
  context: 'default' | 'table' = 'default',
  url?: string | null
): Promise<string> => {
  const $node = $(element)

  if (element.type === 'text') {
    const text = $node.text().trim()
    if (text.length < 2) return ''
    // if text already ends with a punctuation mark, don't add another one
    if (text.match(/[.!?]$/)) return '\n' + text
    return '\n' + text + '.'
  }

  if (element.type !== 'tag') {
    return ''
  }

  const tagName = element.name?.toLowerCase()

  switch (tagName) {
    case 'label':
      return context === 'table'
        ? '<br><b>' + $node.text().trim() + '</b><br>'
        : '\n**' + $node.text().trim() + '**\n'

    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const level = parseInt(tagName.charAt(1))
      // For headings 1 and 2, add 2 line breaks before the heading; for 3 and below, add just 1
      const numberOfLineBreaks = level > 2 ? 1 : 2

      const headingText = $node.text().trim()
      if (!headingText.length) return ''

      // check if heading has a child url
      const headingLink = $node.find('a').first()
      if (headingLink.length && headingLink.attr('href')) {
        const linkHref = headingLink.attr('href')
        return (
          '\n'.repeat(numberOfLineBreaks) + '#'.repeat(level) + '[' + headingText + '](' + linkHref + ')'
        )
      }

      return '\n'.repeat(numberOfLineBreaks) + '#'.repeat(level) + ' ' + headingText
    }

    case 'p': {
      const paragraphText = $node.text().trim()
      if (paragraphText.length > 2) {
        return context === 'table'
          ? `<br>${paragraphText}`
          : `\n${paragraphText}`
      }
      return ''
    }

    case 'a':
      return await handleLinks($, element, context, url || '') || ''

    case 'img': {
      return handleImages($, element, url) || ''
    }

    case 'table':
      return await processTable($, $node, url)

    case 'li':
      return await processList($, $node, context, url)

    case 'strong':
    case 'b': {
      const strongText = $node.text().trim()
      return context === 'table'
        ? `<b>${strongText}</b>`
        : `**${strongText}**`
    }

    case 'em':
    case 'i': {
      const emText = $node.text().trim()
      return context === 'table'
        ? `<i>${emText}</i>`
        : `*${emText}*`
    }

    case 'code':
      return '`' + (await processChildren($, $node, context, url)) + '`'

    case 'pre': {
      const code = $node.find('code')
      if (code.length) {
        const language = code.attr('class')?.split('-')[1]?.trim() || ''
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
      return context === 'table' ? '<br><br>---<br>' : '\n\n---\n'

    default:
      return await processChildren($, $node, context, url)
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
    if (processedText.trim().length > 2) {
      results.push(processedText)
    }
  }

  return results.join('')
}