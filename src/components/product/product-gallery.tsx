'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

function isExternalImage(src: string) {
  return src.startsWith('http://') || src.startsWith('https://')
}

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const realImages = images.filter(
    (img) => isExternalImage(img) || !img.includes('-default.')
  )
  const hasImages = realImages.length > 0

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? realImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === realImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-muted relative flex aspect-square items-center justify-center overflow-hidden rounded-lg">
        {hasImages ? (
          <Image
            src={realImages[currentIndex]}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <Package className="text-muted-foreground h-32 w-32" />
        )}

        {/* Navigation Arrows */}
        {hasImages && realImages.length > 1 && (
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
      {hasImages && realImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {realImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                index === currentIndex
                  ? 'border-primary'
                  : 'hover:border-muted-foreground/50 border-transparent'
              )}
            >
              <Image
                src={img}
                alt={`${productName} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
