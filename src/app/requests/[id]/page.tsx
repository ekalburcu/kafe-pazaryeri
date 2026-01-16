'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  Mail,
  Building2,
  ArrowLeft,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Breadcrumbs } from '@/components/catalog'
import { getRequestById } from '@/lib/data/requests'
import { OrderRequest, RequestStatus } from '@/types'

interface RequestPageProps {
  params: Promise<{ id: string }>
}

const statusConfig: Record<
  RequestStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
  }
> = {
  draft: { label: 'Taslak', variant: 'outline' },
  sent: { label: 'Gönderildi', variant: 'default' },
  viewed: { label: 'Görüntülendi', variant: 'secondary' },
  answered: { label: 'Yanıtlandı', variant: 'default' },
  completed: { label: 'Tamamlandı', variant: 'default' },
  cancelled: { label: 'İptal Edildi', variant: 'destructive' },
}

export default function RequestDetailPage({ params }: RequestPageProps) {
  const { id } = use(params)
  const [request, setRequest] = useState<OrderRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRequest = () => {
      const found = getRequestById(id)
      setRequest(found || null)
      setIsLoading(false)
    }

    loadRequest()
  }, [id])

  const handleCopyId = () => {
    navigator.clipboard.writeText(id)
    toast.success('Talep numarası kopyalandı')
  }

  const breadcrumbItems = [
    { label: 'Talepler', href: '/requests' },
    { label: `Talep #${id.slice(0, 12)}...` },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-muted-foreground">Yükleniyor...</div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="mb-2 text-xl font-semibold">Talep bulunamadı</h2>
          <p className="text-muted-foreground mb-6">
            Aradığınız talep mevcut değil veya silinmiş olabilir.
          </p>
          <Button asChild>
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kataloğa Git
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const status = statusConfig[request.status]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Success Banner */}
      {request.status === 'sent' && (
        <div className="mt-4 mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">
              Talebiniz başarıyla oluşturuldu!
            </p>
            <p className="text-sm text-green-700">
              Tedarikçiler talebinizi inceleyip sizinle iletişime geçecektir.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-2xl font-bold">Talep Detayı</h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-muted-foreground bg-muted rounded px-2 py-1 text-sm">
              {request.id}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopyId}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>
            {new Date(request.createdAt).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Talep Edilen Ürünler</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Tedarikçi</TableHead>
                    <TableHead className="text-right">Miktar</TableHead>
                    <TableHead className="text-right">Birim Fiyat</TableHead>
                    <TableHead className="text-right">Toplam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {request.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-muted-foreground text-xs">
                            {item.productBrand}
                          </p>
                          {item.note && (
                            <p className="text-muted-foreground mt-1 text-xs italic">
                              Not: {item.note}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.vendorName}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.priceMin === item.priceMax
                          ? `${item.priceMin.toLocaleString('tr-TR')} TL`
                          : `${item.priceMin.toLocaleString('tr-TR')} - ${item.priceMax.toLocaleString('tr-TR')} TL`}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.priceMin * item.quantity).toLocaleString(
                          'tr-TR'
                        )}{' '}
                        TL
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">
                    Tahmini Toplam
                  </p>
                  <p className="text-2xl font-bold">
                    {request.totalEstimate.min === request.totalEstimate.max
                      ? `${request.totalEstimate.min.toLocaleString('tr-TR')} TL`
                      : `${request.totalEstimate.min.toLocaleString('tr-TR')} - ${request.totalEstimate.max.toLocaleString('tr-TR')} TL`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Teslimat Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{request.deliveryInfo.address}</p>
              <p>
                {request.deliveryInfo.district}, {request.deliveryInfo.city}
                {request.deliveryInfo.postalCode &&
                  ` - ${request.deliveryInfo.postalCode}`}
              </p>
              {request.deliveryInfo.preferredDate && (
                <p className="text-muted-foreground text-sm">
                  Tercih edilen tarih:{' '}
                  {new Date(
                    request.deliveryInfo.preferredDate
                  ).toLocaleDateString('tr-TR')}
                </p>
              )}
              {request.deliveryInfo.notes && (
                <p className="text-muted-foreground mt-2 text-sm italic">
                  Not: {request.deliveryInfo.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Firma Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">{request.guestInfo.companyName}</p>
                {request.guestInfo.taxNumber && (
                  <p className="text-muted-foreground text-sm">
                    VKN: {request.guestInfo.taxNumber}
                  </p>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium">{request.guestInfo.contactName}</p>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{request.guestInfo.phone}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{request.guestInfo.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="space-y-2 pt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/catalog">Yeni Alışveriş</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => window.print()}
              >
                Yazdır
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
