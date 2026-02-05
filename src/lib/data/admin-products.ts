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
  const adminStored = typeof window !== 'undefined'
    ? (() => {
        try {
          const stored = localStorage.getItem('kafe-market-admin-products')
          return stored ? (JSON.parse(stored) as Product[]) : []
        } catch {
          return [] as Product[]
        }
      })()
    : []

  return [...mockProducts, ...adminStored].map((p) =>
    applyModeration(getProductWithRelations(p))
  )
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

// ─── Admin product CRUD ─────────────────────────────────────────

const ADMIN_PRODUCTS_KEY = 'kafe-market-admin-products'

function getAdminStoredProducts(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(ADMIN_PRODUCTS_KEY)
    if (stored) return JSON.parse(stored) as Product[]
  } catch {
    // ignore
  }
  return []
}

function saveAdminProducts(prods: Product[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(prods))
  } catch (error) {
    console.error('Failed to save admin products:', error)
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function createAdminProduct(
  data: Omit<Product, 'id' | 'slug' | 'createdAt'>
): Product {
  const adminProducts = getAdminStoredProducts()

  const newProduct: Product = {
    ...data,
    id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    slug: generateSlug(data.name),
    createdAt: new Date().toISOString(),
  }

  adminProducts.push(newProduct)
  saveAdminProducts(adminProducts)

  return getProductWithRelations(newProduct)
}

export function updateAdminProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>
): Product | null {
  const adminProducts = getAdminStoredProducts()
  const adminIndex = adminProducts.findIndex((p) => p.id === id)

  if (adminIndex !== -1) {
    adminProducts[adminIndex] = {
      ...adminProducts[adminIndex],
      ...data,
      slug: data.name
        ? generateSlug(data.name)
        : adminProducts[adminIndex].slug,
    }
    saveAdminProducts(adminProducts)
    return getProductWithRelations(adminProducts[adminIndex])
  }

  // If it's a hardcoded product, clone it with updates into admin storage & hide original
  const hardcoded = mockProducts.find((p) => p.id === id)
  if (hardcoded) {
    const updatedProduct: Product = {
      ...hardcoded,
      ...data,
      slug: data.name ? generateSlug(data.name) : hardcoded.slug,
    }
    adminProducts.push(updatedProduct)
    saveAdminProducts(adminProducts)
    hideProduct(id)
    return getProductWithRelations(updatedProduct)
  }

  return null
}

export function deleteAdminProduct(id: string): boolean {
  const adminProducts = getAdminStoredProducts()
  const adminIndex = adminProducts.findIndex((p) => p.id === id)

  if (adminIndex !== -1) {
    adminProducts.splice(adminIndex, 1)
    saveAdminProducts(adminProducts)
    return true
  }

  // If it's a hardcoded product, hide it via moderation
  const hardcoded = mockProducts.find((p) => p.id === id)
  if (hardcoded) {
    hideProduct(id)
    return true
  }

  return false
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
