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
import { Bookmark } from '@/types/bookmark'

export const EditBookmark = ({
  categories, isEditDialogOpen, setIsEditDialogOpen, bookmarks, setBookmarks, editingBookmark, setEditingBookmark
}:
{
  categories: Record<string, string>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  bookmarks: Bookmark[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
  editingBookmark: Bookmark;
  setEditingBookmark: (bookmark: Bookmark | null) => void;
}) => {
  const [title, setTitle] = useState(editingBookmark.title)
  const [url, setUrl] = useState(editingBookmark.url)
  const [category, setCategory] = useState(editingBookmark.category)

  const updateBookmark = () => {
    if (!editingBookmark) return

    const updatedBookmarks = bookmarks.map((bookmark) =>
      bookmark.id === editingBookmark.id
        ? {
          ...bookmark,
          title,
          url: url.startsWith('http') ? url : `https://${url}`,
          category,
        }
        : bookmark,
    )

    setBookmarks(updatedBookmarks)
    setEditingBookmark(null)
    setTitle('')
    setUrl('')
    setCategory('general')
    setIsEditDialogOpen(false)

    toast.success('Bookmark updated', {
      description: 'Your bookmark has been updated successfully'
    })
  }

  if (!editingBookmark) return null


  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogDescription>Update the details of your saved bookmark.</DialogDescription>
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
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={updateBookmark}>Update Bookmark</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}