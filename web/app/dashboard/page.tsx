'use client'

import { useEffect, useState } from 'react'
import { ArrowCircleUpRight, Bookmark as BookmarkIcon, MagnifyingGlass, NotePencil, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { AddUrl } from '@/components/add-url'
import { EditUrl } from '@/components/edit-url'
import { Webpage } from '@/types/webpage'
import Link from 'next/link'
import { Login } from '@/components/login'
import Footer from '@/components/footer'

const categories = {
  general: 'General',
  work: 'Work',
  personal: 'Personal',
  education: 'Education',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  social: 'Social',
  news: 'News',
  other: 'Other',
}

export default function DashboardPage() {
  const [webpages, setWebpages] = useState<Webpage[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingWebpage, setEditingWebpage] = useState<Webpage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // load webpages from localStorage on initial render
  useEffect(() => {
    const savedWebpages = localStorage.getItem('webpages')
    if (savedWebpages) {
      setWebpages(JSON.parse(savedWebpages))
    }
  }, [])

  // save webpages to localStorage whenever they change
  useEffect(() => {
    if (!webpages.length) return
    localStorage.setItem('webpages', JSON.stringify(webpages))
  }, [webpages])

  // get unique categories from web pages
  const uniqueCategories = ['all', ...new Set(webpages.map((page) => page.category))]

  // filter webpages based on search term and active tab
  const filteredWebpages = webpages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === 'all' || page.category === activeTab
    return matchesSearch && matchesCategory
  })

  const deleteWebpage = (id: string) => {
    const updatedPages = webpages.filter((page) => page.id !== id)
    setWebpages(updatedPages)
    localStorage.setItem('webpages', JSON.stringify(updatedPages))
    toast.success('Page deleted', {
      description: 'Your page has been removed',
    })
  }

  const startEditWebpage = (page: Webpage) => {
    setEditingWebpage(page)
    setIsEditDialogOpen(true)
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch (e) {
      return `https://www.google.com/s2/favicons?domain=example.com&sz=64`
    }
  }

  return (
    <div className="container min-h-screen flex flex-col mx-auto pt-8">
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

        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative w-full md:w-64">
            <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search URLs..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <AddUrl isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} title={title} setTitle={setTitle}
                  url={url} setUrl={setUrl} category={category} setCategory={setCategory} webpages={webpages}
                  setWebpages={setWebpages} />
          <Login />
        </div>
      </div>

      {/* Edit Dialog */}
      {editingWebpage && (
        <EditUrl
          webpages={webpages} setWebpages={setWebpages} isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen} editingWebpage={editingWebpage}
          setEditingWebpage={setEditingWebpage} categories={categories}
        />
      )}

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="my-8">
        <TabsList className="mb-4 flex flex-wrap">
          {uniqueCategories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Web pages Grid */}
        <TabsContent value={activeTab} className="mt-0">
          {filteredWebpages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No pages found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? 'Try a different search term or category'
                  : 'Add your first page by clicking the \'Add page\' button'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredWebpages.map((webpage) => (
                <Card key={webpage.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <img
                          src={getFaviconUrl(webpage.url) || '/placeholder.svg'}
                          alt=""
                          className="h-6 w-6 mr-2 rounded-sm"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'https://www.google.com/s2/favicons?domain=example.com&sz=64'
                          }}
                        />
                        <CardTitle className="text-lg line-clamp-1" title={webpage.title}>
                          {webpage.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="truncate mt-1" title={webpage.url}>
                      {webpage.url}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Badge variant="secondary" className="capitalize">
                      {webpage.category}
                    </Badge>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => startEditWebpage(webpage)}>
                        <NotePencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => deleteWebpage(webpage.id)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => window.open(webpage.url, '_blank')}
                              className={'cursor-pointer px-2'}>
                        <ArrowCircleUpRight weight={'regular'} />
                        <span className="sr-only">Open</span>
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4">

                      <Button variant="default" size="sm" onClick={() => {
                        navigator.clipboard.writeText(webpage.markdown || '').then(() => {
                          toast.success('Markdown copied to clipboard', {
                            description: 'You can now paste it anywhere'
                          })
                        })
                      }}
                              className={'cursor-pointer px-2 w-fit'}>
                        Copy markdown
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <Footer />
    </div>
  )
}