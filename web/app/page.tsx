'use client'
import { Input } from '@/components/ui/input'
import { ChangeEvent, useState } from 'react'
import Footer from '@/components/footer'
import { BookmarkSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Login } from '@/components/login'
import { useAuth } from '@clerk/nextjs'
import { FeaturesSection } from '@/components/features-section'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'
import { AnimatedButton } from '@/components/ui/animated-button'
import { Compare } from '@/components/ui/compare'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
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
    <div className="container min-h-screen max-w-5xl flex flex-col mx-auto pt-8 px-6">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex justify-between items-start sm:items-center w-full py-6 gap-2 sm:gap-4">
          <Link href={'/'} className="flex">
            <div className="flex">
              <img
                src="/markify-logo.png"
                alt="Markify logo"
                className="h-10 w-auto mr-2"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-xl sm:text-3xl font-bold font-mono">Markify</h1>
                <p className="hidden sm:block text-base text-muted-foreground">
                  transform web pages into markdown code
                </p>
              </div>
            </div>
          </Link>
          {isSignedIn && (
            <Button asChild className="gap-2 ml-auto">
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
        <Dialog>
          <DialogTrigger asChild className="w-fit mx-auto mt-4">
            <Button
              variant={'outline'}
              className="rounded-full dark:bg-primary/80 dark:text-primary-foreground/80 dark:hover:bg-primary dark:hover:text-primary-foreground"
            >
              View Markdown</Button>
          </DialogTrigger>
          <DialogContent className="h-[calc(100vh-6rem)] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Markdown</DialogTitle>
              <DialogDescription className={'border-b border-b-muted-foreground pb-4'}>
                <span>{url}</span>

                <AnimatedButton
                  className="h-6 w-fit py-2 px-0 my-2 rounded-md text-primary bg-transparent hover:underline"
                  onClick={() => {
                    navigator.clipboard.writeText(markdown)
                  }}>
                <span className="group inline-flex items-center">
                  Copy source
                  <ChevronRightIcon
                    className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                  <span className="group inline-flex items-center">
                  <CheckIcon className="mr-2 size-4" />
                  Copied!
                </span>
                </AnimatedButton>

              </DialogDescription>
            </DialogHeader>
            <Markdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </Markdown>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex flex-col items-center justify-center gap-8 mx-auto my-12">
        <FeaturesSection />
        <div className="flex flex-col items-center justify-center w-fit text-center gap-4 mx-auto mt-12">
          <span className="text-lg text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Easily convert web pages into markdown code with Markify
          </span>
          <Compare
            firstImage="js-example.png"
            secondImage="markdown-example.png"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="h-[350px] w-[350px] md:h-[500px] md:w-[500px]"
            slideMode="hover"
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}