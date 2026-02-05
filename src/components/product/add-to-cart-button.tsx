'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'
import { Product } from '@/types'
import { parseTurkishNumber } from '@/lib/import-utils'
import { cn } from '@/lib/utils'

interface SizeOption {
  label: string
  price: number
}

function parseSizeOptions(specs: Product['specs']): SizeOption[] {
  const pattern = /^(.+?)\s+[Ff]iyat$/
  return specs
    .map((spec) => {
      const match = spec.key.match(pattern)
      if (!match) return null
      return { label: match[1], price: parseTurkishNumber(spec.value) }
    })
    .filter((opt): opt is SizeOption => opt !== null)
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const sizeOptions = parseSizeOptions(product.specs)
  const hasSizes = sizeOptions.length >= 2

  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(
    hasSizes ? sizeOptions[0] : null
  )
  const [quantity, setQuantity] = useState(product.moq)
  const [isAdded, setIsAdded] = useState(false)

  const unitPrice = selectedSize ? selectedSize.price : product.priceMin

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
    addItem(product.id, quantity, selectedSize?.label)
    setIsAdded(true)
    toast.success(`${product.name} sepete eklendi`, {
      description: `${quantity} adet${selectedSize ? ` - ${selectedSize.label}` : ''}`,
    })

    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const isOutOfStock = product.availability === 'out_of_stock'

  return (
    <div className="space-y-4">
      {/* Dynamic Price — rendered here when size variants exist */}
      {hasSizes && (
        <div>
          <p className="text-3xl font-bold">
            {unitPrice.toLocaleString('tr-TR')} TL
          </p>
          <p className="text-muted-foreground text-sm">KDV dahil</p>
        </div>
      )}

      {/* Gramaj Selector */}
      {hasSizes && (
        <div>
          <p className="mb-2 text-sm font-medium">Gramaj</p>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelectedSize(option)}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  selectedSize?.label === option.label
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted text-muted-foreground hover:border-foreground hover:text-foreground'
                )}
              >
                {option.label}
                <span className="ml-1.5 text-xs opacity-70">
                  {option.price.toLocaleString('tr-TR')} ₺
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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
            {(unitPrice * quantity).toLocaleString('tr-TR')} TL
          </span>
          {!hasSizes && product.priceMin !== product.priceMax && (
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
