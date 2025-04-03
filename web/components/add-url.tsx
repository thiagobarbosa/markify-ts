import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusCircle } from '@phosphor-icons/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Webpage } from '@/types/webpage'

export const AddUrl = ({
  isDialogOpen,
  setIsDialogOpen,
  title,
  setTitle,
  url,
  setUrl,
  category,
  setCategory,
  webpages,
  setWebpages
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  url: string;
  setUrl: (url: string) => void;
  category: string;
  setCategory: (category: string) => void;
  webpages: Webpage[];
  setWebpages: (webpages: Webpage[]) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const addWebpage = async () => {
    setIsLoading(true)
    try {
      if (!title || !url) {
        toast.error('Please fill in all fields')
        return
      }

      // Add http:// if not present
      let formattedUrl = url
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl
      }


      const response = await fetch(`/api/markify?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      const markdown = result.markdown

      const newWebpage: Webpage = {
        id: Date.now().toString(),
        title,
        url: formattedUrl,
        category,
        createdAt: new Date().toISOString(),
        markdown
      }

      setWebpages([...webpages, newWebpage])
      setTitle('')
      setUrl('')
      setCategory('general')
      setIsDialogOpen(false)

      toast.success('Page added', {
        description: 'Your page has been saved successfully',
      })
    } catch (error: any) {
      console.error('Error adding page:', error)
      toast.error('Failed to add page', {
        description: 'Please try again later or with a different URL',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={'cursor-pointer'}>
          <PlusCircle className="h-4 w-4" />
          Add page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add page</DialogTitle>
          <DialogDescription>Enter the details of the website you want to save.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Website Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="link" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={addWebpage} disabled={isLoading} className={'w-36'}>
            {!isLoading && <span>Save page</span>}
            {isLoading && <span>Saving...</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}