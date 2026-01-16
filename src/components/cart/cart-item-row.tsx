'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CartItem } from '@/types'
import { useCart } from '@/context/cart-context'

interface CartItemRowProps {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, updateNote, removeItem } = useCart()
  const { product } = item

  if (!product) return null

  const handleDecrease = () => {
    if (item.quantity > product.moq) {
      updateQuantity(item.productId, item.quantity - 1)
    }
  }

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= product.moq) {
      updateQuantity(item.productId, value)
    }
  }

  const lineTotal = {
    min: product.priceMin * item.quantity,
    max: product.priceMax * item.quantity,
  }

  return (
    <div className="flex flex-col gap-4 border-b py-4 last:border-b-0 sm:flex-row sm:items-start">
      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="bg-muted flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg"
      >
        <Package className="text-muted-foreground h-10 w-10" />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/product/${product.slug}`}
              className="font-semibold hover:underline"
            >
              {product.name}
            </Link>
            <p className="text-muted-foreground text-sm">{product.brand}</p>
            {product.vendor && (
              <p className="text-muted-foreground text-xs">
                Satıcı: {product.vendor.name}
              </p>
            )}
          </div>
          <Badge variant="outline" className="flex-shrink-0">
            {product.leadTimeDays} gün teslimat
          </Badge>
        </div>

        {/* Price per unit */}
        <p className="text-sm">
          Birim fiyat:{' '}
          <span className="font-medium">
            {product.priceMin === product.priceMax
              ? `${product.priceMin.toLocaleString('tr-TR')} TL`
              : `${product.priceMin.toLocaleString('tr-TR')} - ${product.priceMax.toLocaleString('tr-TR')} TL`}
          </span>
        </p>

        {/* Quantity & Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrease}
              disabled={item.quantity <= product.moq}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={handleQuantityChange}
              min={product.moq}
              className="h-8 w-16 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrease}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-muted-foreground text-xs">
            Min. sipariş: {product.moq}
          </span>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive ml-auto"
            onClick={() => removeItem(item.productId)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Kaldır
          </Button>
        </div>

        {/* Note */}
        <div className="mt-2">
          <Input
            placeholder="Not ekle (opsiyonel)"
            value={item.note || ''}
            onChange={(e) => updateNote(item.productId, e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Line Total */}
        <div className="text-right">
          <p className="text-lg font-bold">
            {lineTotal.min === lineTotal.max
              ? `${lineTotal.min.toLocaleString('tr-TR')} TL`
              : `${lineTotal.min.toLocaleString('tr-TR')} - ${lineTotal.max.toLocaleString('tr-TR')} TL`}
          </p>
        </div>
      </div>
    </div>
  )
}
