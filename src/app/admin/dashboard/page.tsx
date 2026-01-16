'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Package,
  FolderTree,
  FileText,
  TrendingUp,
  AlertTriangle,
  Clock,
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
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAuth } from '@/context/auth-context'
import { getVendorStats, getVendorsByStatus } from '@/lib/data/vendors'
import { getProductStats, getAllProductsForAdmin } from '@/lib/data/admin-products'
import { getCategoryStats } from '@/lib/data/categories'
import { getAllRequests } from '@/lib/data/requests'
import { Vendor, Product, OrderRequest } from '@/types'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [vendorStats, setVendorStats] = useState({ total: 0, approved: 0, pending: 0, suspended: 0 })
  const [productStats, setProductStats] = useState({ total: 0, active: 0, hidden: 0, flagged: 0 })
  const [categoryStats, setCategoryStats] = useState({ total: 0, withProducts: 0, empty: 0 })
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([])
  const [flaggedProducts, setFlaggedProducts] = useState<Product[]>([])
  const [recentRequests, setRecentRequests] = useState<OrderRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

      // Load stats
      setVendorStats(getVendorStats())
      setProductStats(getProductStats())
      setCategoryStats(getCategoryStats())

      // Load pending vendors
      setPendingVendors(getVendorsByStatus('pending'))

      // Load flagged products
      const allProducts = getAllProductsForAdmin()
      setFlaggedProducts(allProducts.filter((p) => p.flagged).slice(0, 5))

      // Load recent requests
      const requests = getAllRequests()
      setRecentRequests(requests.slice(0, 5))

      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  if (authLoading || isLoading) {
    return (
      <AdminLayout title="Dashboard">
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
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Dashboard"
      description="Platform yönetim paneline hoş geldiniz"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tedarikçiler</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorStats.total}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="default">{vendorStats.approved} onaylı</Badge>
              {vendorStats.pending > 0 && (
                <Badge variant="secondary">{vendorStats.pending} bekleyen</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ürünler</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats.total}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="default">{productStats.active} aktif</Badge>
              {productStats.flagged > 0 && (
                <Badge variant="destructive">{productStats.flagged} işaretli</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {categoryStats.withProducts} kategori ürün içeriyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Talepler</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Toplam teklif talebi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Vendors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Onay Bekleyen Tedarikçiler
              </CardTitle>
              <CardDescription>
                İnceleme gerektiren yeni başvurular
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/vendors">
                Tümü
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingVendors.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-green-600" />
                <p className="mt-4 text-muted-foreground">
                  Bekleyen başvuru bulunmuyor
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.city} • {vendor.createdAt && new Date(vendor.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <Button size="sm" asChild>
                      <Link href="/admin/vendors">İncele</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flagged Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                İşaretli Ürünler
              </CardTitle>
              <CardDescription>İnceleme gerektiren ürünler</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">
                Tümü
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {flaggedProducts.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-green-600" />
                <p className="mt-4 text-muted-foreground">
                  İşaretli ürün bulunmuyor
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {flaggedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-destructive">
                        {product.flagReason || 'Sebep belirtilmemiş'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/admin/products">İncele</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Son Talepler</CardTitle>
              <CardDescription>Platform üzerindeki son teklif talepleri</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/requests">
                Tümü
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Henüz talep bulunmuyor
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{request.guestInfo.companyName}</p>
                        <Badge variant="outline">{request.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.items.length} ürün •{' '}
                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/requests/${request.id}`}>Görüntüle</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
