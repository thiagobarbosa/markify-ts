import cheerio from 'cheerio'
import { processChildren } from '@/lib/markdown/handlers/elements'

/**
 * Maximum number of rows to process in a table,
 * mainly to prevent processing large tables that might burn too many LLM tokens.
 */
const MAX_ROWS_PER_TABLE = 10

export const processTable = async (
  $: cheerio.Root,
  $node: cheerio.Cheerio,
  url?: string | null
): Promise<string> => {
  let markdown = '\n\n'
  const rows = $node.find('tr').toArray()
  const matrix: string[][] = []

  // build matrix from table
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const $row = $(rows[rowIndex])
    const cells = $row.find('th, td').toArray()
    matrix[rowIndex] = matrix[rowIndex] || []

    let colIndex = 0
    for (const cell of cells) {
      const $cell = $(cell)
      // skip already filled cells from previous rowspans
      while (matrix[rowIndex][colIndex]) colIndex++

      const content = cleanupCellContent(
        await processChildren($, $cell, 'table', url)
      )

      const rowspan = parseInt($cell.attr('rowspan') || '1')

      // fill the matrix for cells with a rowspan
      for (let i = 0; i < rowspan; i++) {
        if (!matrix[rowIndex + i]) matrix[rowIndex + i] = []
        matrix[rowIndex + i][colIndex] = content
      }
      colIndex++
    }
  }

  // build markdown table
  matrix.forEach((row, rowIndex) => {
    if (rowIndex > MAX_ROWS_PER_TABLE) return
    markdown += '|' + row.join('|') + '|\n'
    // after the header row, add a separator row with dashes.
    if (rowIndex === 0) {
      markdown += '|' + row.map(() => '---').join('|') + '|\n'
    }
  })

  return markdown
}

function cleanupCellContent(content: string): string {
  return (
    content
      // replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // escape any pipe character that might be interpreted as a column separator.
      .replace(/\|(?![^[]*])/g, '\\|')
      .trim()
  )
}
