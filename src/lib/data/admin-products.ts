import { Product } from '@/types'
import { products as mockProducts, getProductWithRelations } from './products'

const PRODUCT_MODERATION_KEY = 'kafe-market-product-moderation'

interface ProductModeration {
  isActive: boolean
  flagged: boolean
  flagReason?: string
}

// Load product moderation overrides from localStorage
function getModerationOverrides(): Record<string, ProductModeration> {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(PRODUCT_MODERATION_KEY)
    if (stored) {
      return JSON.parse(stored) as Record<string, ProductModeration>
    }
  } catch (error) {
    console.error('Failed to load product moderation:', error)
  }
  return {}
}

// Save product moderation overrides to localStorage
function saveModerationOverrides(
  overrides: Record<string, ProductModeration>
): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(PRODUCT_MODERATION_KEY, JSON.stringify(overrides))
  } catch (error) {
    console.error('Failed to save product moderation:', error)
  }
}

// Apply moderation to a product
function applyModeration(product: Product): Product {
  const overrides = getModerationOverrides()
  const moderation = overrides[product.id]

  if (moderation) {
    return {
      ...product,
      isActive: moderation.isActive,
      flagged: moderation.flagged,
      flagReason: moderation.flagReason,
    }
  }

  // Default: product is active and not flagged
  return {
    ...product,
    isActive: product.isActive !== false,
    flagged: product.flagged || false,
  }
}

// Get all products with moderation applied (for admin)
export function getAllProductsForAdmin(): Product[] {
  return mockProducts.map((p) => applyModeration(getProductWithRelations(p)))
}

// Get product by ID with moderation applied
export function getProductForAdmin(id: string): Product | undefined {
  const product = mockProducts.find((p) => p.id === id)
  if (product) {
    return applyModeration(getProductWithRelations(product))
  }
  return undefined
}

// Toggle product active status
export function toggleProductActive(id: string): Product | null {
  const product = mockProducts.find((p) => p.id === id)
  if (!product) return null

  const overrides = getModerationOverrides()
  const current = overrides[id] || { isActive: true, flagged: false }

  overrides[id] = {
    ...current,
    isActive: !current.isActive,
  }

  saveModerationOverrides(overrides)

  return applyModeration(getProductWithRelations(product))
}

// Flag a product for review
export function flagProduct(id: string, reason: string): Product | null {
  const product = mockProducts.find((p) => p.id === id)
  if (!product) return null

  const overrides = getModerationOverrides()
  const current = overrides[id] || { isActive: true, flagged: false }

  overrides[id] = {
    ...current,
    flagged: true,
    flagReason: reason,
  }

  saveModerationOverrides(overrides)

  return applyModeration(getProductWithRelations(product))
}

// Unflag a product
export function unflagProduct(id: string): Product | null {
  const product = mockProducts.find((p) => p.id === id)
  if (!product) return null

  const overrides = getModerationOverrides()
  const current = overrides[id] || { isActive: true, flagged: false }

  overrides[id] = {
    ...current,
    flagged: false,
    flagReason: undefined,
  }

  saveModerationOverrides(overrides)

  return applyModeration(getProductWithRelations(product))
}

// Hide product (set isActive to false)
export function hideProduct(id: string): Product | null {
  const product = mockProducts.find((p) => p.id === id)
  if (!product) return null

  const overrides = getModerationOverrides()
  const current = overrides[id] || { isActive: true, flagged: false }

  overrides[id] = {
    ...current,
    isActive: false,
  }

  saveModerationOverrides(overrides)

  return applyModeration(getProductWithRelations(product))
}

// Show product (set isActive to true)
export function showProduct(id: string): Product | null {
  const product = mockProducts.find((p) => p.id === id)
  if (!product) return null

  const overrides = getModerationOverrides()
  const current = overrides[id] || { isActive: true, flagged: false }

  overrides[id] = {
    ...current,
    isActive: true,
  }

  saveModerationOverrides(overrides)

  return applyModeration(getProductWithRelations(product))
}

// Check if product is active
export function isProductActive(id: string): boolean {
  const overrides = getModerationOverrides()
  const moderation = overrides[id]

  if (moderation) {
    return moderation.isActive
  }

  // Default: products are active
  return true
}

// Get product stats for admin dashboard
export function getProductStats(): {
  total: number
  active: number
  hidden: number
  flagged: number
} {
  const allProducts = getAllProductsForAdmin()
  return {
    total: allProducts.length,
    active: allProducts.filter((p) => p.isActive !== false).length,
    hidden: allProducts.filter((p) => p.isActive === false).length,
    flagged: allProducts.filter((p) => p.flagged).length,
  }
}
