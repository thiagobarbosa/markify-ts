import { mkdir, writeFile } from 'fs/promises'
import { generateMarkdown } from '@/services/markdown/markdown-generator'
import { dirname } from 'path'

const main = async () => {
  const args = process.argv.slice(2)

  let html = null
  let url = null
  let outputPath = 'outputs/markdown.md'
  const indexReference = Math.round(args.length / 2)

  const urlIndex = args.findIndex((arg) => arg.startsWith('--url'))
  if (urlIndex !== -1) {
    url = args[urlIndex + indexReference]
  }

  const htmlIndex = args.findIndex((arg) => arg.startsWith('--html'))
  if (htmlIndex !== -1) {
    html = args[htmlIndex + indexReference]
  }

  const outputIndex = args.findIndex((arg) => arg.startsWith('--output'))
  if (outputIndex !== -1) {
    outputPath = args[outputIndex + indexReference] || outputPath
  }

  console.log({ url, html, outputPath })

  if (!url && !html) {
    console.error('Error: Neither URL nor HTML provided')
    return
  }

  try {
    const markdown = await generateMarkdown(html, url)
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