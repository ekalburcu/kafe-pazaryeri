'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderTree,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/ui/data-table'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAuth } from '@/context/auth-context'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  defaultCategories,
} from '@/lib/data/categories'
import { Category } from '@/types'
import { toast } from 'sonner'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const loadCategories = () => {
    const allCategories = getAllCategories()
    setCategories(allCategories)
  }

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      if (user?.role !== 'admin') {
        router.push('/account')
        return
      }

      loadCategories()
      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  const openCreateDialog = () => {
    setEditingCategory(null)
    setCategoryName('')
    setDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!categoryName.trim()) {
      toast.error('Kategori adı gerekli')
      return
    }

    if (editingCategory) {
      // Update
      const updated = updateCategory(editingCategory.id, { name: categoryName })
      if (updated) {
        toast.success('Kategori güncellendi')
        loadCategories()
      } else {
        toast.error('Güncelleme başarısız')
      }
    } else {
      // Create
      createCategory({ name: categoryName })
      toast.success('Kategori oluşturuldu')
      loadCategories()
    }

    setDialogOpen(false)
    setCategoryName('')
    setEditingCategory(null)
  }

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      const success = deleteCategory(categoryToDelete.id)
      if (success) {
        toast.success('Kategori silindi')
        loadCategories()
      } else {
        toast.error('Bu kategori silinemez (varsayılan kategori)')
      }
    }
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const isDefaultCategory = (id: string) => {
    return defaultCategories.some((c) => c.id === id)
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Kategori Adı',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: 'productCount',
      header: 'Ürün Sayısı',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.productCount || 0}</span>
      ),
    },
    {
      id: 'type',
      header: 'Tür',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {isDefaultCategory(row.original.id) ? 'Varsayılan' : 'Özel'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const category = row.original
        const isDefault = isDefaultCategory(category.id)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </DropdownMenuItem>
              {!isDefault && (
                <DropdownMenuItem
                  onClick={() => handleDelete(category)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (authLoading || isLoading) {
    return (
      <AdminLayout title="Kategoriler">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Kategoriler"
      description="Ürün kategorilerini yönetin"
      action={
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kategori
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Kategori ara..."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Kategori bilgilerini güncelleyin'
                : 'Yeni bir kategori oluşturun'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Kategori Adı</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Kategori adı giriniz"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'Güncelle' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{categoryToDelete?.name}&quot; kategorisini silmek
              istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
