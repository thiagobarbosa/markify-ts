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
import { Bookmark } from '@/types/bookmark'

export const AddBookmark = ({
  isDialogOpen,
  setIsDialogOpen,
  title,
  setTitle,
  url,
  setUrl,
  category,
  setCategory,
  bookmarks,
  setBookmarks
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  url: string;
  setUrl: (url: string) => void;
  category: string;
  setCategory: (category: string) => void;
  bookmarks: Bookmark[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
}) => {
  const addBookmark = () => {
    if (!title || !url) {
      toast.error('Please fill in all fields')
      return
    }

    // Add http:// if not present
    let formattedUrl = url
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title,
      url: formattedUrl,
      category,
      createdAt: new Date().toISOString(),
    }

    setBookmarks([...bookmarks, newBookmark])
    setTitle('')
    setUrl('')
    setCategory('general')
    setIsDialogOpen(false)

    toast.success('Bookmark added', {
      description: 'Your bookmark has been saved successfully',
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
          <DialogDescription>Enter the details of the website you want to save.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={addBookmark}>Save Bookmark</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}