'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({
  images,
  productName: _productName,
}: ProductGalleryProps) {
  // _productName will be used for alt text when real images are implemented
  const [currentIndex, setCurrentIndex] = useState(0)

  // Eğer resim yoksa placeholder göster
  const hasImages = images.length > 0

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-muted relative flex aspect-square items-center justify-center overflow-hidden rounded-lg">
        {hasImages ? (
          // Gerçek resim gösterilecek
          <Package className="text-muted-foreground h-32 w-32" />
        ) : (
          <Package className="text-muted-foreground h-32 w-32" />
        )}

        {/* Navigation Arrows */}
        {hasImages && images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'bg-muted flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                index === currentIndex
                  ? 'border-primary'
                  : 'hover:border-muted-foreground/50 border-transparent'
              )}
            >
              <Package className="text-muted-foreground h-8 w-8" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
