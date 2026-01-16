'use client'

import Link from 'next/link'
import { Truck, Clock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/cart-context'

export function SummaryCard() {
  const { getItemCount, getSubtotal, getCartWithProducts } = useCart()

  const itemCount = getItemCount()
  const subtotal = getSubtotal()
  const cartItems = getCartWithProducts()

  // Tahmini teslimat süresi (en uzun lead time)
  const maxLeadTime = cartItems.reduce((max, item) => {
    return item.product ? Math.max(max, item.product.leadTimeDays) : max
  }, 0)

  // Benzersiz vendor sayısı
  const vendorCount = new Set(
    cartItems.map((item) => item.product?.vendorId).filter(Boolean)
  ).size

  if (itemCount === 0) {
    return null
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Sipariş Özeti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item Count */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ürün sayısı</span>
          <span>{itemCount} adet</span>
        </div>

        {/* Vendor Count */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tedarikçi sayısı</span>
          <span>{vendorCount}</span>
        </div>

        <Separator />

        {/* Subtotal */}
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

        <Separator />

        {/* Info Items */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span>Tahmini teslimat: {maxLeadTime} iş günü</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="text-muted-foreground h-4 w-4" />
            <span>Kargo ücreti tedarikçiye göre değişir</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-muted-foreground h-4 w-4" />
            <span>Güvenli alışveriş garantisi</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" size="lg" asChild>
          <Link href="/checkout/request">Teklif / Sipariş Talebi Oluştur</Link>
        </Button>
        <p className="text-muted-foreground text-center text-xs">
          Ödeme yapılmayacak, tedarikçilere talep iletilecektir.
        </p>
      </CardFooter>
    </Card>
  )
}
