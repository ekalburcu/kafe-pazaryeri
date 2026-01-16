'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import {
  isProductFavorite,
  toggleProductFavorite,
  isVendorFavorite,
  toggleVendorFavorite,
} from '@/lib/data/favorites'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  itemId: string
  type: 'product' | 'vendor'
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export function FavoriteButton({
  itemId,
  type,
  variant = 'ghost',
  size = 'icon',
  className,
  showLabel = false,
}: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const checkFavorite =
        type === 'product' ? isProductFavorite : isVendorFavorite
      setIsFavorite(checkFavorite(user.id, itemId))
    }
  }, [isAuthenticated, user, itemId, type])

  const handleToggle = () => {
    if (!isAuthenticated || !user) {
      toast.error('Favorilere eklemek için giriş yapmalısınız')
      return
    }

    setIsLoading(true)
    try {
      const toggleFn =
        type === 'product' ? toggleProductFavorite : toggleVendorFavorite
      const newState = toggleFn(user.id, itemId)
      setIsFavorite(newState)

      if (newState) {
        toast.success(
          type === 'product'
            ? 'Ürün favorilere eklendi'
            : 'Tedarikçi favorilere eklendi'
        )
      } else {
        toast.success(
          type === 'product'
            ? 'Ürün favorilerden çıkarıldı'
            : 'Tedarikçi favorilerden çıkarıldı'
        )
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleToggle()
      }}
      disabled={isLoading}
      className={cn(
        'transition-colors',
        isFavorite && 'text-red-500 hover:text-red-600',
        className
      )}
      aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Heart
        className={cn(
          'h-4 w-4',
          isFavorite && 'fill-current',
          showLabel && 'mr-2'
        )}
      />
      {showLabel && (isFavorite ? 'Favorilerde' : 'Favorilere Ekle')}
    </Button>
  )
}
