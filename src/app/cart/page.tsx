'use client'

import Link from 'next/link'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/catalog'
import { CartItemRow, SummaryCard } from '@/components/cart'
import { useCart } from '@/context/cart-context'

export default function CartPage() {
  const { getCartWithProducts, isLoading, clearCart } = useCart()

  const cartItems = getCartWithProducts()
  const isEmpty = cartItems.length === 0

  const breadcrumbItems = [{ label: 'Sepet' }]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-muted-foreground">Yükleniyor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-4 mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sepetim</h1>
        {!isEmpty && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Sepeti Temizle
          </Button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="mb-2 text-xl font-semibold">Sepetiniz boş</h2>
          <p className="text-muted-foreground mb-6">
            Sepetinizde henüz ürün bulunmuyor. Kataloğumuzu keşfedin!
          </p>
          <Button asChild>
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Alışverişe Devam Et
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border p-4">
              {cartItems.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/catalog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Alışverişe Devam Et
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <SummaryCard />
          </div>
        </div>
      )}
    </div>
  )
}
