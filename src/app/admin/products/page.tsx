'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import {
  MoreHorizontal,
  Eye,
  EyeOff,
  Flag,
  CheckCircle,
  AlertTriangle,
  Plus,
  Upload,
  Pencil,
  Trash2,
  Images,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable } from '@/components/ui/data-table'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAuth } from '@/context/auth-context'
import {
  getAllProductsForAdmin,
  hideProduct,
  showProduct,
  flagProduct,
  unflagProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '@/lib/data/admin-products'
import { Product } from '@/types'
import { ProductFormData } from '@/lib/schemas/product'
import { ProductForm } from '@/components/vendor/product-form'
import { ImportProductsModal } from '@/components/admin/import-products-modal'
import { PdfImageExtractorModal } from '@/components/admin/pdf-image-extractor-modal'
import { ImportedProduct } from '@/lib/import-utils'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { getAllVendors } from '@/lib/data/vendors'

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Add / Edit dialog
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formVendorId, setFormVendorId] = useState('')

  // Import modal
  const [importModalOpen, setImportModalOpen] = useState(false)

  // PDF image extractor modal
  const [pdfImageModalOpen, setPdfImageModalOpen] = useState(false)

  // Flag dialog
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [productToFlag, setProductToFlag] = useState<Product | null>(null)
  const [flagReason, setFlagReason] = useState('')

  // Delete confirm dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const vendors = getAllVendors()

  const loadProducts = async () => {
    setProducts(await getAllProductsForAdmin())
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

      loadProducts().then(() => setIsLoading(false))
    }
  }, [authLoading, isAuthenticated, user, router])

  // ─── Add / Edit ──────────────────────────────────────────────
  const openAddDialog = () => {
    setEditingProduct(null)
    setFormVendorId('')
    setFormDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormVendorId(product.vendorId)
    setFormDialogOpen(true)
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    const productData = {
      ...data,
      vendorId: formVendorId || 'kahve-dunyasi',
    }

    if (editingProduct) {
      await updateAdminProduct(editingProduct.id, productData)
      toast.success('Ürün güncellendi')
    } else {
      await createAdminProduct(productData)
      toast.success('Ürün eklendi')
    }

    setFormDialogOpen(false)
    await loadProducts()
  }

  // ─── Delete ──────────────────────────────────────────────────
  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (productToDelete) {
      await deleteAdminProduct(productToDelete.id)
      toast.success('Ürün silindi')
    }
    setDeleteDialogOpen(false)
    setProductToDelete(null)
    await loadProducts()
  }

  // ─── Import ──────────────────────────────────────────────────
  const handleImport = async (importedProducts: ImportedProduct[]) => {
    await Promise.all(
      importedProducts.map((p) =>
        createAdminProduct({
          name: p.name,
          categoryId: p.categoryId,
          brand: p.brand,
          vendorId: p.vendorId || 'kahve-dunyasi',
          priceMin: p.priceMin,
          priceMax: p.priceMax,
          description: p.description || `${p.name} ürünü`,
          tags: p.tags,
          specs: p.specs,
          images: p.imageDataUrl
            ? [p.imageDataUrl]
            : ['/images/products/coffee-default.jpg'],
          moq: 1,
          leadTimeDays: 3,
          availability: 'in_stock',
        })
      )
    )
    toast.success(`${importedProducts.length} ürün başarıyla eklendi`)
    await loadProducts()
  }

  // ─── Show / Hide ─────────────────────────────────────────────
  const handleToggleActive = async (product: Product) => {
    if (product.isActive === false) {
      await showProduct(product.id)
      toast.success('Ürün katalogda gösterilecek')
    } else {
      await hideProduct(product.id)
      toast.success('Ürün katalogdan gizlendi')
    }
    await loadProducts()
  }

  // ─── Flag ────────────────────────────────────────────────────
  const openFlagDialog = (product: Product) => {
    setProductToFlag(product)
    setFlagReason(product.flagReason || '')
    setFlagDialogOpen(true)
  }

  const handleFlag = async () => {
    if (productToFlag) {
      if (flagReason.trim()) {
        await flagProduct(productToFlag.id, flagReason)
        toast.success('Ürün işaretlendi')
      } else {
        toast.error('Sebep giriniz')
        return
      }
    }
    setFlagDialogOpen(false)
    setProductToFlag(null)
    setFlagReason('')
    await loadProducts()
  }

  const handleUnflag = async (product: Product) => {
    await unflagProduct(product.id)
    toast.success('İşaret kaldırıldı')
    await loadProducts()
  }

  // ─── Columns ─────────────────────────────────────────────────
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Ürün',
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.brand}</p>
        </div>
      ),
    },
    {
      accessorKey: 'vendor',
      header: 'Tedarikçi',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.vendor?.name || '-'}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Kategori',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.category?.name || '-'}</span>
      ),
    },
    {
      accessorKey: 'priceMin',
      header: 'Fiyat',
      cell: ({ row }) => (
        <span className="text-sm">
          {formatCurrency(row.original.priceMin)} -{' '}
          {formatCurrency(row.original.priceMax)}
        </span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Durum',
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex flex-col gap-1">
            <Badge variant={product.isActive !== false ? 'default' : 'secondary'}>
              {product.isActive !== false ? 'Aktif' : 'Gizli'}
            </Badge>
            {product.flagged && (
              <Badge variant="outline">
                <AlertTriangle className="mr-1 h-3 w-3" />
                İşaretli
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/product/${product.slug}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Görüntüle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditDialog(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {product.isActive !== false ? (
                <DropdownMenuItem onClick={() => handleToggleActive(product)}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Gizle
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleToggleActive(product)}
                  className="text-green-600"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Göster
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {product.flagged ? (
                <DropdownMenuItem
                  onClick={() => handleUnflag(product)}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  İşareti Kaldır
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => openFlagDialog(product)}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  İşaretle
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDeleteDialog(product)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (authLoading || isLoading) {
    return (
      <AdminLayout title="Ürünler">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Ürünler"
      description="Platform ürünlerini yönetin ve modere edin"
    >
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={() => setPdfImageModalOpen(true)}>
          <Images className="mr-2 h-4 w-4" />
          PDF Görselleri
        </Button>
        <Button variant="outline" onClick={() => setImportModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Ürün Ekle
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Ürün ara..."
      />

      {/* Add / Edit Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Ürün bilgilerini düzenleyin ve kaydedin'
                : 'Yeni ürün bilgilerini doldurun'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Tedarikçi</Label>
            <Select value={formVendorId} onValueChange={setFormVendorId}>
              <SelectTrigger>
                <SelectValue placeholder="Tedarikçi seçin" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ProductForm
            initialData={editingProduct || undefined}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <ImportProductsModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImport}
      />

      {/* PDF Image Extractor */}
      <PdfImageExtractorModal
        open={pdfImageModalOpen}
        onOpenChange={setPdfImageModalOpen}
      />

      {/* Flag Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünü İşaretle</DialogTitle>
            <DialogDescription>
              &quot;{productToFlag?.name}&quot; ürününü inceleme için işaretleyin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Sebep</Label>
              <Input
                id="reason"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="İşaretleme sebebini giriniz"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleFlag}>
              İşaretle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürün Sil</DialogTitle>
            <DialogDescription>
              &quot;{productToDelete?.name}&quot; ürünü silmek istediğinizden emin
              misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleDelete}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
