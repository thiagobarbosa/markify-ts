import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { Webpage } from '@/types/webpage'

export const EditUrl = ({
  categories, isEditDialogOpen, setIsEditDialogOpen, webpages, setWebpages, editingWebpage, setEditingWebpage
}:
{
  categories: Record<string, string>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  webpages: Webpage[];
  setWebpages: (webpages: Webpage[]) => void;
  editingWebpage: Webpage;
  setEditingWebpage: (webpage: Webpage | null) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(editingWebpage.title)
  const [url, setUrl] = useState(editingWebpage.url)
  const [category, setCategory] = useState(editingWebpage.category)

  const updateWebpage = async () => {
    setIsLoading(true)
    if (!editingWebpage) return

    try {
      const existingWebpage = webpages.find((page) => page.id === editingWebpage.id)
      if (!existingWebpage) {
        toast.error('Page not found')
        return
      }

      const updatedWebpage = {
        ...existingWebpage,
        title,
        url,
        category
      }

      if (existingWebpage.url !== url) {
        const response = await fetch(`/api/markify?url=${encodeURIComponent(url)}`)
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        updatedWebpage.markdown = result.markdown
      }

      setWebpages(
        webpages.map((page) => (page.id === editingWebpage.id ? updatedWebpage : page))
      )
      setEditingWebpage(null)
      setTitle('')
      setUrl('')
      setCategory('general')
      setIsEditDialogOpen(false)

      toast.success('Page updated', {
        description: 'Your page has been updated successfully.'
      })
    } catch (error: any) {
      console.error('Error updating page:', error)
      toast.error('Error updating page', {
        description: 'Please try again later.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!editingWebpage) return null

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit page</DialogTitle>
          <DialogDescription>Update the details of your saved page.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="Website Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(categories).map((cat, index) => (
                  <SelectItem key={cat} value={cat}>
                    {categories[cat as keyof typeof categories]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="link" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={updateWebpage} disabled={isLoading} className={'min-w-36'}>
            {!isLoading && <span>Update page</span>}
            {isLoading && <span>Updating...</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}