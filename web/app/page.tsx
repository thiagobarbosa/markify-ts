'use client'
import { Input } from '@/components/ui/input'
import { ChangeEvent, useState } from 'react'
import Footer from '@/components/footer'
import { ArrowsInLineVertical, ArrowsOutLineVertical, BookmarkSimple, Copy } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader } from '@/components/ui/loader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Login } from '@/components/login'
import { useAuth } from '@clerk/nextjs'
import { FeaturesSection } from '@/components/features-section'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [isMarkdownExpanded, setIsMarkdownExpanded] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const { isSignedIn } = useAuth()

  // Function to validate URL
  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (e: any) {
      return false
    }
  }

  const handleSubmit = async () => {
    // Reset error state
    setError('')

    // Validate URL before submitting
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/markify?url=${encodeURIComponent(url)}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      setMarkdown(result.markdown)
    } catch (e: any) {
      setError(`Failed to fetch markdown: ${e.message}`)
      setMarkdown('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    // Clear error when user starts typing again
    if (error) setError('')
  }

  const handleClear = () => {
    setMarkdown('')
    setError('')
    setUrl('')
  }

  return (
    <div className="container min-h-screen max-w-5xl flex flex-col mx-auto px-6 pt-8">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex justify-between items-start lg:items-center w-full py-6">
          <Link href={'/'} className="flex">
            <div className="flex">
              <img
                src="/markify-logo.png"
                alt="Markify logo"
                className="h-10 w-auto mr-2"
              />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold font-mono">Markify</h1>
                <p className="text-base text-muted-foreground">
                  transform web pages into markdown code
                </p>
              </div>
            </div>
          </Link>
          {isSignedIn && (
            <Button asChild className="gap-2 ml-auto mr-4">
              <Link href="/dashboard">
                <BookmarkSimple className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          <Login />
        </div>
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

        <div className="flex gap-4 lg:min-w-[400px] w-full sm:w-auto items-center flex-col">
          <Input
            className="h-10"
            placeholder="Enter URL (e.g., https://example.com)"
            type="url"
            required
            value={url}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && url && !isLoading) {
                handleSubmit()
              }
            }}
            aria-invalid={error ? 'true' : 'false'}
          />

          <div className="flex items-center flex-col">
            <Button
              variant={'outline'}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 px-4 sm:px-5 sm:w-auto w-fit cursor-pointer"
              type="submit"
              disabled={!url || isLoading}
              onClick={handleSubmit}
            >
              Get Markdown
              {isLoading && <div className="ml-4"><Loader /></div>}
            </Button>
            <Button
              variant="link"
              className="flex items-center justify-center font-medium text-base sm:w-auto cursor-pointer py-0"
              disabled={!markdown && !error && !url}
              onClick={handleClear}
            >
              Clear
            </Button>
            {error && (
              <Alert variant="destructive" className="min-w-[400px] w-auto border-none text-destructive p-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {markdown && (
        <Collapsible open={isMarkdownExpanded} className="w-full">
          <CollapsibleTrigger
            className={'flex w-full items-center justify-between gap-2 border-b-2 border-b-black/[.08] dark:border-b-white/[.145] p-4'}
            onClick={() => setIsMarkdownExpanded(!isMarkdownExpanded)}
          >
            <div className="">
              {isMarkdownExpanded ? 'Hide Markdown' : 'View Markdown'}
            </div>
            {isMarkdownExpanded ?
              <ArrowsInLineVertical size={24} /> :
              <ArrowsOutLineVertical size={24} />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <section
              className="w-full mx-auto max-h-[400px] overflow-auto px-8 my-8 bg-white dark:bg-black/[.85] p-4 border rounded-md">
              <div
                className="relative top-4 right-0 flex items-center justify-end gap-2 text-black/[.5] dark:text-white/[.5] cursor-pointer">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Copy size={32} onClick={() => navigator.clipboard.writeText(markdown)} />
                    </TooltipTrigger>
                    <TooltipContent>Copy Markdown code</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Markdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </Markdown>
            </section>
          </CollapsibleContent>
        </Collapsible>
      )}
      <div className="flex flex-col items-center justify-center gap-8 mx-auto my-12">
        <FeaturesSection />
      </div>
      <Footer />
    </div>
  )
}