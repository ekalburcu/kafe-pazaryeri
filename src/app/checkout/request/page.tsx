'use client'

import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Breadcrumbs } from '@/components/catalog'
import { RequestForm } from '@/components/checkout'
import { useCart } from '@/context/cart-context'

export default function CheckoutRequestPage() {
  const { getCartWithProducts, getSubtotal, isLoading } = useCart()

  const cartItems = getCartWithProducts()
  const subtotal = getSubtotal()
  const isEmpty = cartItems.length === 0

  const breadcrumbItems = [
    { label: 'Sepet', href: '/cart' },
    { label: 'Teklif / Sipariş Talebi' },
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

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="mb-2 text-xl font-semibold">Sepetiniz boş</h2>
          <p className="text-muted-foreground mb-6">
            Talep oluşturmak için önce sepetinize ürün eklemeniz gerekiyor.
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold">Teklif / Sipariş Talebi</h1>
        <p className="text-muted-foreground mt-1">
          Bilgilerinizi doldurun, tedarikçiler sizinle iletişime geçsin.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <RequestForm />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Talep Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-start gap-3">
                    <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded">
                      <Package className="text-muted-foreground h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.product?.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.quantity} adet ×{' '}
                        {item.product?.priceMin.toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Vendor breakdown */}
              <div>
                <p className="text-muted-foreground mb-2 text-sm">
                  Tedarikçiler:
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(
                    new Set(
                      cartItems
                        .map((item) => item.product?.vendor?.name)
                        .filter(Boolean)
                    )
                  ).map((vendorName) => (
                    <Badge
                      key={vendorName}
                      variant="secondary"
                      className="text-xs"
                    >
                      {vendorName}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between">
                <span className="font-medium">Tahmini Toplam</span>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {subtotal.min === subtotal.max
                      ? `${subtotal.min.toLocaleString('tr-TR')} TL`
                      : `${subtotal.min.toLocaleString('tr-TR')} - ${subtotal.max.toLocaleString('tr-TR')} TL`}
                  </p>
                  <p className="text-muted-foreground text-xs">KDV dahil</p>
                </div>
              </div>

              {/* Back to cart */}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Sepete Dön
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
