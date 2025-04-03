'use client'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Footer from '@/components/Footer'
import { Copy } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader } from '@/components/ui/loader'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async () => {
    setIsLoading(true)
    const result = await fetch(`/api/markify?url=${url}`).then((res) => res.json())
    setMarkdown(result.markdown)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="flex flex-col items-center justify-center gap-8 font-[family-name:var(--font-geist-sans)]">
        <Image
          src="/markify.png"
          alt="Markify logo"
          width={270}
          height={57}
          priority
        />
        <ol
          className="text-lg text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="tracking-[-.01em]">
            Paste a URL to extract the{' '}
            <code
              className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              markdown
            </code>
            .
          </li>
        </ol>

        <div className="flex gap-8 items-center flex-col">
          <Input
            className="min-w-[400px] w-full sm:w-auto h-10"
            placeholder="Enter URL"
            type="url"
            required
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
            }}
          />
          <div className={'flex items-center flex-col flex-col'}>
            <Button
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto w-fit cursor-pointer"
              type="submit"
              disabled={!url || isLoading}
              onClick={handleSubmit}
            >
              Get Markdown
              {isLoading && <div className="ml-4"><Loader /></div>}
            </Button>
            <Button
              variant={'link'}
              className="flex items-center justify-center font-medium text-base p-0 sm:w-auto w-fit cursor-pointer"
              disabled={!markdown}
              onClick={() => {
                setMarkdown('')
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {markdown && (
        <section
          className="w-full max-w-[800px] mx-auto max-h-[400px] overflow-auto p-8 bg-white dark:bg-black/[.85] rounded-lg shadow-lg">
          <div
            className="relative flex items-center justify-end gap-2 text-black/[.5] dark:text-white/[.5] cursor-pointer">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy size={32} onClick={() => navigator.clipboard.writeText(markdown)} />
                </TooltipTrigger>
                <TooltipContent>Copy Markdown code</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <pre className="h-fit text-sm/6 whitespace-pre-wrap break-words">
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </pre>
        </section>
      )}

      <Footer />
    </div>
  )
}