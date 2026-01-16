'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  FileText,
  Settings,
  LogOut,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Heart,
  RefreshCw,
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
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'
import { getRequestsByUserId, getAllRequests } from '@/lib/data/requests'
import { toast } from 'sonner'
import { OrderRequest, RequestStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'

const statusConfig: Record<
  RequestStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }
> = {
  draft: { label: 'Taslak', variant: 'outline', icon: Clock },
  sent: { label: 'Gönderildi', variant: 'default', icon: Package },
  viewed: { label: 'Görüntülendi', variant: 'secondary', icon: Eye },
  answered: { label: 'Yanıtlandı', variant: 'default', icon: CheckCircle },
  completed: { label: 'Tamamlandı', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'İptal', variant: 'destructive', icon: XCircle },
}

export default function AccountRequestsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const { reorderFromRequest } = useCart()
  const [requests, setRequests] = useState<OrderRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleReorder = (request: OrderRequest) => {
    reorderFromRequest(request)
    toast.success(`${request.items.length} ürün sepete eklendi`)
    router.push('/cart')
  }

  useEffect(() => {
    if (!authLoading && user) {
      // Load requests for the current user
      const userRequests = getRequestsByUserId(user.id)
      // Also get all requests without userId (guest requests) for demo purposes
      const allRequests = getAllRequests()
      const guestRequests = allRequests.filter((r) => !r.userId)
      setRequests([...userRequests, ...guestRequests])
      setIsLoading(false)
    }
  }, [authLoading, user])

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Taleplerim</h1>
        <p className="text-muted-foreground mt-1">
          Gönderdiğiniz teklif taleplerini görüntüleyin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar Navigation */}
        <Card className="h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Profil
              </Link>
              <Link
                href="/account/requests"
                className="flex items-center gap-3 rounded-md bg-muted px-3 py-2 text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Taleplerim
              </Link>
              <Link
                href="/account/favorites"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                Favorilerim
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Ayarlar
              </Link>
              <Separator className="my-2" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Requests Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Teklif Talepleri</CardTitle>
                  <CardDescription>
                    Toplam {requests.length} talep
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/catalog">Yeni Talep Oluştur</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Henüz talebiniz yok</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ürünleri sepetinize ekleyin ve teklif talebi gönderin.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/catalog">Ürünlere Göz At</Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Talep No</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Ürün Sayısı</TableHead>
                        <TableHead>Tutar</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => {
                        const status = statusConfig[request.status]
                        const StatusIcon = status.icon
                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-sm">
                              {request.id}
                            </TableCell>
                            <TableCell>
                              {new Date(request.createdAt).toLocaleDateString(
                                'tr-TR'
                              )}
                            </TableCell>
                            <TableCell>{request.items.length} ürün</TableCell>
                            <TableCell>
                              {formatCurrency(request.totalEstimate.min)} -{' '}
                              {formatCurrency(request.totalEstimate.max)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/requests/${request.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReorder(request)}
                                  title="Tekrar Sipariş Ver"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
