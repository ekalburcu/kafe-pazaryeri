import { UserFavorites, Product, Vendor } from '@/types'
import { getProductById } from './products'
import { getVendorById } from './vendors'

const FAVORITES_STORAGE_KEY = 'kafemarket_favorites'

// Get favorites from localStorage
export function getFavorites(userId: string): UserFavorites {
  if (typeof window === 'undefined') {
    return {
      userId,
      productIds: [],
      vendorIds: [],
      updatedAt: new Date().toISOString(),
    }
  }

  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
  if (stored) {
    const allFavorites: Record<string, UserFavorites> = JSON.parse(stored)
    if (allFavorites[userId]) {
      return allFavorites[userId]
    }
  }

  return {
    userId,
    productIds: [],
    vendorIds: [],
    updatedAt: new Date().toISOString(),
  }
}

// Save favorites to localStorage
function saveFavorites(userId: string, favorites: UserFavorites): void {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
  const allFavorites: Record<string, UserFavorites> = stored
    ? JSON.parse(stored)
    : {}

  allFavorites[userId] = {
    ...favorites,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites))
}

// Product Favorites
export function addProductToFavorites(userId: string, productId: string): void {
  const favorites = getFavorites(userId)
  if (!favorites.productIds.includes(productId)) {
    favorites.productIds.push(productId)
    saveFavorites(userId, favorites)
  }
}

export function removeProductFromFavorites(
  userId: string,
  productId: string
): void {
  const favorites = getFavorites(userId)
  favorites.productIds = favorites.productIds.filter((id) => id !== productId)
  saveFavorites(userId, favorites)
}

export function isProductFavorite(userId: string, productId: string): boolean {
  const favorites = getFavorites(userId)
  return favorites.productIds.includes(productId)
}

export function toggleProductFavorite(
  userId: string,
  productId: string
): boolean {
  if (isProductFavorite(userId, productId)) {
    removeProductFromFavorites(userId, productId)
    return false
  } else {
    addProductToFavorites(userId, productId)
    return true
  }
}

export function getFavoriteProducts(userId: string): Product[] {
  const favorites = getFavorites(userId)
  return favorites.productIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== null)
}

// Vendor Favorites
export function addVendorToFavorites(userId: string, vendorId: string): void {
  const favorites = getFavorites(userId)
  if (!favorites.vendorIds.includes(vendorId)) {
    favorites.vendorIds.push(vendorId)
    saveFavorites(userId, favorites)
  }
}

export function removeVendorFromFavorites(
  userId: string,
  vendorId: string
): void {
  const favorites = getFavorites(userId)
  favorites.vendorIds = favorites.vendorIds.filter((id) => id !== vendorId)
  saveFavorites(userId, favorites)
}

export function isVendorFavorite(userId: string, vendorId: string): boolean {
  const favorites = getFavorites(userId)
  return favorites.vendorIds.includes(vendorId)
}

export function toggleVendorFavorite(
  userId: string,
  vendorId: string
): boolean {
  if (isVendorFavorite(userId, vendorId)) {
    removeVendorFromFavorites(userId, vendorId)
    return false
  } else {
    addVendorToFavorites(userId, vendorId)
    return true
  }
}

export function getFavoriteVendors(userId: string): Vendor[] {
  const favorites = getFavorites(userId)
  return favorites.vendorIds
    .map((id) => getVendorById(id))
    .filter((v): v is Vendor => v !== null)
}

// Frequently Ordered (based on request history)
export function getFrequentlyOrderedProducts(userId: string): Product[] {
  if (typeof window === 'undefined') return []

  // Get user's requests from localStorage
  const stored = localStorage.getItem('kafemarket_requests')
  if (!stored) return []

  const requests = JSON.parse(stored)
  const userRequests = requests.filter(
    (r: { userId?: string }) => r.userId === userId
  )

  // Count product occurrences
  const productCounts: Record<string, number> = {}
  userRequests.forEach((request: { items: { productId: string }[] }) => {
    request.items.forEach((item: { productId: string }) => {
      productCounts[item.productId] =
        (productCounts[item.productId] || 0) + 1
    })
  })

  // Sort by frequency and get top products
  const sortedProductIds = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id]) => id)

  return sortedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== null)
}

// Get favorites stats
export function getFavoritesStats(userId: string): {
  productCount: number
  vendorCount: number
} {
  const favorites = getFavorites(userId)
  return {
    productCount: favorites.productIds.length,
    vendorCount: favorites.vendorIds.length,
  }
}
