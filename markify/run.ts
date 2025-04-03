import { mkdir, writeFile } from 'fs/promises'
import { generateMarkdown } from '@/lib/markdown/markdown-generator'
import { dirname } from 'path'

const main = async () => {
  const args = process.argv.slice(2)

  let html = null
  let url = null
  let outputPath = 'outputs/markdown.md'
  let ignoreSelectors: string[] = []

  // Improved argument parsing
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && i + 1 < args.length) {
      url = args[i + 1]
      i++ // Skip the next argument as we've used it as a value
    } else if (args[i] === '--html' && i + 1 < args.length) {
      html = args[i + 1]
      i++
    } else if (args[i] === '--output' && i + 1 < args.length) {
      outputPath = args[i + 1]
      i++
    } else if (args[i] === '--ignore' && i + 1 < args.length) {
      ignoreSelectors = args[i + 1].split(',')
      i++
    }
  }

  console.log({ url, html, outputPath, ignoreSelectors })

  if (!url && !html) {
    console.error('Error: Neither URL nor HTML provided')
    return
  }

  try {
    const markdown = await generateMarkdown({ html, url, ignoreSelectors })
    const outputDir = dirname(outputPath)

    mkdir(outputDir, { recursive: true }).then(() => {
      writeFile(outputPath, markdown, 'utf-8').then(() => {
        console.log(`Markdown successfully saved to ${outputPath}`)
      })
    })
  } catch (error: any) {
    console.error(error.message)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main()
}