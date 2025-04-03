'use client'
import { Input } from '@/components/ui/input'
import { ChangeEvent, useState } from 'react'
import Footer from '@/components/footer'
import { BookmarkSimple, Copy, SignOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader } from '@/components/ui/loader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SignInButton, useAuth, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { dark } from '@clerk/themes'
import { Login } from '@/components/login'

export default function Home() {
  const { isSignedIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

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
    <div className="container min-h-screen flex flex-col mx-auto my-8">
      <div className="flex flex-col items-center justify-center gap-8 font-[family-name:var(--font-geist-sans)]">
        <div className="flex justify-between items-center w-full p-6">
          <Link href={'/'} className="hidden md:flex">
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
          <Button asChild className="gap-2 ml-auto mr-4">
            <Link href="/dashboard">
              <BookmarkSimple className="h-4 w-4" />
              My Bookmarks
            </Link>
          </Button>
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

        <div className="flex gap-8 min-w-[400px] w-full sm:w-auto items-center flex-col">
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

          <div className="flex items-center flex-col gap-2">
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
              className="flex items-center justify-center font-medium text-base sm:w-auto cursor-pointer"
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
        <section
          className="w-full max-w-[900px] mx-auto max-h-[400px] overflow-auto px-8 my-8 bg-white dark:bg-black/[.85] rounded-lg shadow-lg">
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
          <pre className="h-fit text-sm/6 whitespace-pre-wrap break-words reactMarkDown">
          {/*<SyntaxHighlighter language="markdown" style={vs2015}>*/}
            <Markdown remarkPlugins={[remarkGfm]}>
            {markdown}
            </Markdown>
            {/*</SyntaxHighlighter>*/}
          </pre>
        </section>
      )}

      <Footer />
    </div>
  )
}