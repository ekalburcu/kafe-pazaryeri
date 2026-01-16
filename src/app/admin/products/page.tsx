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
import { DataTable } from '@/components/ui/data-table'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAuth } from '@/context/auth-context'
import {
  getAllProductsForAdmin,
  hideProduct,
  showProduct,
  flagProduct,
  unflagProduct,
} from '@/lib/data/admin-products'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Flag dialog
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [productToFlag, setProductToFlag] = useState<Product | null>(null)
  const [flagReason, setFlagReason] = useState('')

  const loadProducts = () => {
    const allProducts = getAllProductsForAdmin()
    setProducts(allProducts)
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

      loadProducts()
      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleToggleActive = (product: Product) => {
    if (product.isActive === false) {
      showProduct(product.id)
      toast.success('Ürün katalogda gösterilecek')
    } else {
      hideProduct(product.id)
      toast.success('Ürün katalogdan gizlendi')
    }
    loadProducts()
  }

  const openFlagDialog = (product: Product) => {
    setProductToFlag(product)
    setFlagReason(product.flagReason || '')
    setFlagDialogOpen(true)
  }

  const handleFlag = () => {
    if (productToFlag) {
      if (flagReason.trim()) {
        flagProduct(productToFlag.id, flagReason)
        toast.success('Ürün işaretlendi')
      } else {
        toast.error('Sebep giriniz')
        return
      }
    }
    setFlagDialogOpen(false)
    setProductToFlag(null)
    setFlagReason('')
    loadProducts()
  }

  const handleUnflag = (product: Product) => {
    unflagProduct(product.id)
    toast.success('İşaret kaldırıldı')
    loadProducts()
  }

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
              <Badge variant="destructive">
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
                  className="text-destructive"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  İşaretle
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
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Ürün ara..."
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
            <Button variant="destructive" onClick={handleFlag}>
              İşaretle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
