'use client'

import { useEffect, useState } from 'react'
import { ArrowCircleUpRight, Bookmark as BookmarkIcon, MagnifyingGlass, NotePencil, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { AddBookmark } from '@/components/add-bookmark'
import { EditBookmark } from '@/components/edit-bookmark'
import { Bookmark } from '@/types/bookmark'

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

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks')
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  // Get unique categories from bookmarks
  const uniqueCategories = ['all', ...new Set(bookmarks.map((bookmark) => bookmark.category))]

  // Filter bookmarks based on search term and active tab
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === 'all' || bookmark.category === activeTab
    return matchesSearch && matchesCategory
  })

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id))
    toast.success('Bookmark deleted', {
      description: 'Your bookmark has been removed',
    })
  }

  const startEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
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
    <div className="container mx-auto py-8 px-6">
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 mb-8">
        <div className="flex ">
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

        <div className="flex w-full md:w-auto space-x-2">
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

          <AddBookmark isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} title={title} setTitle={setTitle}
                       url={url} setUrl={setUrl} category={category} setCategory={setCategory} bookmarks={bookmarks}
                       setBookmarks={setBookmarks} />
        </div>
      </div>

      {/* Edit Dialog */}
      {editingBookmark && (
        <EditBookmark
          bookmarks={bookmarks} setBookmarks={setBookmarks} isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen} editingBookmark={editingBookmark}
          setEditingBookmark={setEditingBookmark} categories={categories}
        />
      )}

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 flex flex-wrap">
          {uniqueCategories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Bookmarks Grid */}
        <TabsContent value={activeTab} className="mt-0">
          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No bookmarks found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? 'Try a different search term or category'
                  : 'Add your first bookmark by clicking the \'Add Bookmark\' button'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <img
                          src={getFaviconUrl(bookmark.url) || '/placeholder.svg'}
                          alt=""
                          className="h-6 w-6 mr-2 rounded-sm"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'https://www.google.com/s2/favicons?domain=example.com&sz=64'
                          }}
                        />
                        <CardTitle className="text-lg truncate" title={bookmark.title}>
                          {bookmark.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="truncate mt-1" title={bookmark.url}>
                      {bookmark.url}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Badge variant="secondary" className="capitalize">
                      {bookmark.category}
                    </Badge>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => startEditBookmark(bookmark)}>
                        <NotePencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => deleteBookmark(bookmark.id)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => window.open(bookmark.url, '_blank')}
                              className={'cursor-pointer px-2'}>
                        <ArrowCircleUpRight weight={'regular'} />
                        <span className="sr-only">Open</span>
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4">

                      <Button variant="default" size="sm" onClick={() => {
                        navigator.clipboard.writeText(bookmark.markdown || '').then(() => {
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
    </div>
  )
}