import cheerio from 'cheerio'
import { handleLinks } from '@/lib/markdown/handlers/links'
import { handleImages } from '@/lib/markdown/handlers/images'
import { processList } from '@/lib/markdown/handlers/lists'

export const MIN_TEXT_LENGTH = 3

const normalizeWhitespace = (text: string): string => {
  return text.replace(/\s+/g, ' ')
}

export const processElement = async (
  $: cheerio.Root,
  element: cheerio.Element,
  context: 'default' | 'table' = 'default',
  url?: string | null
): Promise<string> => {
  const $node = $(element)

  if (element.type === 'text') {
    return normalizeWhitespace($node.text())
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
      const content = await processChildren($, $node, context, url)
      return context === 'table' ?
        '<br>' + content :
        '\n\n' + content
    }

    case 'a': {
      const linkResult = await handleLinks($, element, url)
      return linkResult || ''
    }

    case 'img': {
      return handleImages($, element, url) || ''
    }

    // Processing tables needs a little love
    // case 'table':
    //   return await processTable($, $node, url)

    case 'ol':
    case 'ul':
      return await processList($, $node, context, url)

    case 'li':
      return await processChildren($, $node, context, url)

    case 'strong':
    case 'b': {
      const content = await processChildren($, $node, context, url)
      return context === 'table'
        ? '<b>' + content.trim() + '</b>'
        : '**' + content.trim() + '**'
    }

    case 'em':
    case 'i': {
      const content = await processChildren($, $node, context, url)
      return context === 'table'
        ? '<i>' + content.trim() + '</i>'
        : '*' + content.trim() + '*'
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
    if (processedText.trim().length >= MIN_TEXT_LENGTH) {
      results.push(processedText)
    }
  }

  return results.join('')
}