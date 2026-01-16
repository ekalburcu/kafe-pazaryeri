'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'
import { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(product.moq)
  const [isAdded, setIsAdded] = useState(false)

  const handleDecrease = () => {
    if (quantity > product.moq) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= product.moq) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    addItem(product.id, quantity)
    setIsAdded(true)
    toast.success(`${product.name} sepete eklendi`, {
      description: `${quantity} adet`,
    })

    // Reset button after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const isOutOfStock = product.availability === 'out_of_stock'

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Miktar:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleDecrease}
            disabled={quantity <= product.moq || isOutOfStock}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={product.moq}
            className="h-9 w-20 text-center"
            disabled={isOutOfStock}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleIncrease}
            disabled={isOutOfStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-muted-foreground text-sm">
          (Min. {product.moq} adet)
        </span>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdded}
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Sepete Eklendi
          </>
        ) : isOutOfStock ? (
          'Stokta Yok'
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Sepete Ekle
          </>
        )}
      </Button>

      {/* Total Preview */}
      {!isOutOfStock && (
        <p className="text-muted-foreground text-center text-sm">
          Toplam:{' '}
          <span className="text-foreground font-medium">
            {(product.priceMin * quantity).toLocaleString('tr-TR')} TL
          </span>
          {product.priceMin !== product.priceMax && (
            <span>
              {' '}
              - {(product.priceMax * quantity).toLocaleString('tr-TR')} TL
            </span>
          )}
        </p>
      )}
    </div>
  )
}
