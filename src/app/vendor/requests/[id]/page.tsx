'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
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
import { VendorLayout } from '@/components/vendor/vendor-layout'
import { RequestResponseBox } from '@/components/vendor/request-response-box'
import { useAuth } from '@/context/auth-context'
import {
  getRequestById,
  addVendorResponse,
  updateRequestStatus,
} from '@/lib/data/requests'
import { getVendorById } from '@/lib/data/vendors'
import { OrderRequest, VendorResponse } from '@/types'
import { RequestResponseFormData } from '@/lib/schemas/product'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function VendorRequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.id as string
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [request, setRequest] = useState<OrderRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

      // Load request
      const foundRequest = getRequestById(requestId)
      if (foundRequest) {
        // Check if this request has items from this vendor
        const hasVendorItems = foundRequest.items.some(
          (item) => item.vendorId === user?.vendorId
        )

        if (!hasVendorItems) {
          toast.error('Bu talebe erişim yetkiniz yok')
          router.push('/vendor/requests')
          return
        }

        setRequest(foundRequest)

        // Mark as viewed if it's new
        if (foundRequest.status === 'sent') {
          updateRequestStatus(requestId, 'viewed')
        }
      } else {
        toast.error('Talep bulunamadı')
        router.push('/vendor/requests')
      }

      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router, requestId])

  const handleResponseSubmit = async (data: RequestResponseFormData) => {
    if (!user?.vendorId || !request) return

    setIsSubmitting(true)

    try {
      const vendor = getVendorById(user.vendorId)
      const updated = addVendorResponse(request.id, {
        vendorId: user.vendorId,
        vendorName: vendor?.name || user.companyName || 'Tedarikçi',
        unitPrice: data.unitPrice,
        deliveryDays: data.deliveryDays,
        message: data.message,
        validUntil: data.validUntil,
      })

      if (updated) {
        setRequest(updated)
        toast.success('Yanıtınız gönderildi')
      } else {
        toast.error('Yanıt gönderilemedi')
      }
    } catch (error) {
      console.error('Failed to submit response:', error)
      toast.error('Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <VendorLayout title="Talep Detayı">
        <div className="space-y-6">
          <div className="h-48 animate-pulse bg-muted rounded-lg" />
          <div className="h-64 animate-pulse bg-muted rounded-lg" />
        </div>
      </VendorLayout>
    )
  }

  if (!request) {
    return (
      <VendorLayout title="Talep Detayı">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Talep bulunamadı</p>
          <Button className="mt-4" asChild>
            <Link href="/vendor/requests">Taleplere Dön</Link>
          </Button>
        </div>
      </VendorLayout>
    )
  }

  // Get vendor's items from this request
  const vendorItems = request.items.filter(
    (item) => item.vendorId === user?.vendorId
  )

  // Get existing vendor response
  const existingResponse = request.vendorResponses?.find(
    (r) => r.vendorId === user?.vendorId
  ) as VendorResponse | undefined

  return (
    <VendorLayout
      title={`Talep #${request.id}`}
      description={`${request.guestInfo.companyName} - ${new Date(request.createdAt).toLocaleDateString('tr-TR')}`}
      action={
        <Button variant="outline" asChild>
          <Link href="/vendor/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Şirket</p>
                    <p className="font-medium">{request.guestInfo.companyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">İletişim</p>
                    <p className="font-medium">{request.guestInfo.contactName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <p className="font-medium">{request.guestInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <p className="font-medium">{request.guestInfo.phone}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teslimat Adresi</p>
                    <p className="font-medium">
                      {request.deliveryInfo.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.deliveryInfo.district}, {request.deliveryInfo.city}
                    </p>
                  </div>
                </div>

                {request.deliveryInfo.preferredDate && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tercih Edilen Tarih
                      </p>
                      <p className="font-medium">
                        {new Date(
                          request.deliveryInfo.preferredDate
                        ).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {request.deliveryInfo.notes && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground mb-1">
                    Teslimat Notu:
                  </p>
                  <p className="text-sm">{request.deliveryInfo.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendor's Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sizden İstenen Ürünler
              </CardTitle>
              <CardDescription>
                Bu talebin sizinle ilgili ürünleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead className="text-right">Miktar</TableHead>
                    <TableHead className="text-right">Fiyat Aralığı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.productBrand}
                          </p>
                          {item.note && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              Not: {item.note}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity} adet
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.priceMin)} -{' '}
                        {formatCurrency(item.priceMax)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-medium">Toplam Tahmini</span>
                <span className="font-bold">
                  {formatCurrency(
                    vendorItems.reduce(
                      (sum, item) => sum + item.priceMin * item.quantity,
                      0
                    )
                  )}{' '}
                  -{' '}
                  {formatCurrency(
                    vendorItems.reduce(
                      (sum, item) => sum + item.priceMax * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Response Box */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Talep Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Talep No</span>
                  <span className="font-mono">{request.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarih</span>
                  <span>
                    {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Durum</span>
                  <Badge
                    variant={existingResponse ? 'default' : 'secondary'}
                  >
                    {existingResponse ? 'Yanıtlandı' : 'Yanıt Bekliyor'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <RequestResponseBox
            existingResponse={existingResponse}
            onSubmit={handleResponseSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </VendorLayout>
  )
}
