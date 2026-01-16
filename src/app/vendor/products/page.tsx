'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { VendorLayout } from '@/components/vendor/vendor-layout'
import { useAuth } from '@/context/auth-context'
import {
  getProductsByVendorId,
  deleteProduct,
  isProductEditable,
} from '@/lib/data/vendor-products'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const availabilityLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  in_stock: { label: 'Stokta', variant: 'default' },
  limited: { label: 'Sınırlı', variant: 'secondary' },
  pre_order: { label: 'Ön Sipariş', variant: 'outline' },
  out_of_stock: { label: 'Stok Dışı', variant: 'destructive' },
}

export default function VendorProductsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const loadProducts = () => {
    if (user?.vendorId) {
      const vendorProducts = getProductsByVendorId(user.vendorId)
      setProducts(vendorProducts)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      if (user?.role !== 'vendor') {
        router.push('/account')
        return
      }

      loadProducts()
      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete && user?.vendorId) {
      const success = deleteProduct(productToDelete.id, user.vendorId)
      if (success) {
        toast.success('Ürün silindi')
        loadProducts()
      } else {
        toast.error('Bu ürün silinemez (demo ürünü)')
      }
    }
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Ürün Adı',
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.brand}</p>
        </div>
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
      accessorKey: 'moq',
      header: 'Min. Sipariş',
      cell: ({ row }) => <span className="text-sm">{row.original.moq} adet</span>,
    },
    {
      accessorKey: 'availability',
      header: 'Stok',
      cell: ({ row }) => {
        const status = availabilityLabels[row.original.availability]
        return <Badge variant={status.variant}>{status.label}</Badge>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original
        const editable = isProductEditable(product.id)

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
              <DropdownMenuItem asChild>
                <Link href={`/vendor/products/${product.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Düzenle
                </Link>
              </DropdownMenuItem>
              {editable && (
                <DropdownMenuItem
                  onClick={() => handleDelete(product)}
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
      <VendorLayout title="Ürünlerim">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </VendorLayout>
    )
  }

  return (
    <VendorLayout
      title="Ürünlerim"
      description="Ürünlerinizi yönetin ve yeni ürünler ekleyin"
      action={
        <Button asChild>
          <Link href="/vendor/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün
          </Link>
        </Button>
      }
    >
      {products.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Henüz ürün yok</h3>
          <p className="mt-2 text-muted-foreground">
            İlk ürününüzü ekleyerek satışa başlayın
          </p>
          <Button className="mt-6" asChild>
            <Link href="/vendor/products/new">
              <Plus className="mr-2 h-4 w-4" />
              İlk Ürünü Ekle
            </Link>
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="Ürün ara..."
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{productToDelete?.name}&quot; ürününü silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
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
    </VendorLayout>
  )
}
