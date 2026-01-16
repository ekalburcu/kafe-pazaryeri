'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VendorLayout } from '@/components/vendor/vendor-layout'
import { useAuth } from '@/context/auth-context'
import {
  getProductsByVendorId,
  getVendorProductStats,
} from '@/lib/data/vendor-products'
import { getAllRequests } from '@/lib/data/requests'
import { Product, OrderRequest } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function VendorDashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    limited: 0,
    outOfStock: 0,
  })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [pendingRequests, setPendingRequests] = useState<OrderRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

      if (user?.vendorId) {
        // Load stats
        const productStats = getVendorProductStats(user.vendorId)
        setStats(productStats)

        // Load recent products
        const products = getProductsByVendorId(user.vendorId)
        setRecentProducts(products.slice(0, 5))

        // Load pending requests (requests that contain vendor's products)
        const allRequests = getAllRequests()
        const vendorRequests = allRequests.filter((req) =>
          req.items.some((item) => item.vendorId === user.vendorId)
        )
        setPendingRequests(
          vendorRequests.filter((r) => r.status === 'sent' || r.status === 'viewed')
        )
      }

      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  if (authLoading || isLoading) {
    return (
      <VendorLayout title="Dashboard">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 animate-pulse bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout
      title="Dashboard"
      description={`Hoş geldin, ${user?.name?.split(' ')[0] || 'Tedarikçi'}!`}
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Aktif ürün sayısı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stokta</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.inStock}
            </div>
            <p className="text-xs text-muted-foreground">Hazır ürünler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sınırlı Stok</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.limited}
            </div>
            <p className="text-xs text-muted-foreground">Dikkat gerektiren</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Talep</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pendingRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">Yanıt bekleyen</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Son Ürünler</CardTitle>
              <CardDescription>En son eklenen ürünleriniz</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/vendor/products">
                Tümü
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Henüz ürün eklenmemiş
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/vendor/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Ürünü Ekle
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(product.priceMin)} -{' '}
                        {formatCurrency(product.priceMax)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        product.availability === 'in_stock'
                          ? 'default'
                          : product.availability === 'limited'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {product.availability === 'in_stock'
                        ? 'Stokta'
                        : product.availability === 'limited'
                          ? 'Sınırlı'
                          : 'Stok Dışı'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bekleyen Talepler</CardTitle>
              <CardDescription>Yanıt bekleyen teklif talepleri</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/vendor/requests">
                Tümü
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Bekleyen talep bulunmuyor
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.slice(0, 5).map((request) => (
                  <Link
                    key={request.id}
                    href={`/vendor/requests/${request.id}`}
                    className="block rounded-lg border p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {request.guestInfo.companyName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.items.length} ürün •{' '}
                          {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {request.status === 'sent' ? 'Yeni' : 'Görüntülendi'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/vendor/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Ürün Ekle
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vendor/products">
                <Package className="mr-2 h-4 w-4" />
                Ürünleri Yönet
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vendor/requests">
                <FileText className="mr-2 h-4 w-4" />
                Talepleri Görüntüle
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </VendorLayout>
  )
}
