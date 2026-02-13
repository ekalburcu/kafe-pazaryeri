'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

const availabilityLabels: Record<
  string,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  in_stock: { label: 'Stokta', variant: 'default' },
  limited: { label: 'Sınırlı Stok', variant: 'secondary' },
  pre_order: { label: 'Ön Sipariş', variant: 'outline' },
  out_of_stock: { label: 'Tükendi', variant: 'destructive' },
}

function isExternalImage(src: string) {
  return src.startsWith('http://') || src.startsWith('https://')
}

export function ProductCard({ product }: ProductCardProps) {
  const availability =
    availabilityLabels[product.availability] || availabilityLabels.in_stock
  const imageUrl = product.images?.[0]
  const hasRealImage = imageUrl && (isExternalImage(imageUrl) || !imageUrl.includes('-default.'))

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative">
          <Link href={`/product/${product.slug}`}>
            <div className="bg-muted relative flex aspect-square items-center justify-center overflow-hidden">
              {hasRealImage ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <Package className="text-muted-foreground h-16 w-16" />
              )}
              {product.featured && (
                <Badge className="absolute top-2 left-2 z-10" variant="default">
                  Öne Çıkan
                </Badge>
              )}
            </div>
          </Link>
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton
              itemId={product.id}
              type="product"
              variant="outline"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant={availability.variant} className="text-xs">
            {availability.label}
          </Badge>
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
          )}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="group-hover:text-primary mb-1 line-clamp-2 font-semibold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground mb-2 text-sm">{product.brand}</p>
        {product.vendor && (
          <p className="text-muted-foreground text-xs">
            Satıcı: {product.vendor.name}
          </p>
        )}
        <div className="mt-auto pt-3">
          <p className="text-lg font-bold">
            {product.priceMin === product.priceMax
              ? `${product.priceMin.toLocaleString('tr-TR')} TL`
              : `${product.priceMin.toLocaleString('tr-TR')} - ${product.priceMax.toLocaleString('tr-TR')} TL`}
          </p>
          <p className="text-muted-foreground text-xs">
            Min. sipariş: {product.moq} adet • {product.leadTimeDays} gün
            teslimat
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/product/${product.slug}`}>Detayları Gör</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
