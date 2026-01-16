import { Product } from '@/types'
import { products as mockProducts, getProductWithRelations } from './products'

const VENDOR_PRODUCTS_KEY = 'kafe-market-vendor-products'

// Load vendor products from localStorage
function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(VENDOR_PRODUCTS_KEY)
    if (stored) {
      return JSON.parse(stored) as Product[]
    }
  } catch (error) {
    console.error('Failed to load vendor products:', error)
  }
  return []
}

// Save vendor products to localStorage
function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(VENDOR_PRODUCTS_KEY, JSON.stringify(products))
  } catch (error) {
    console.error('Failed to save vendor products:', error)
  }
}

// Generate slug from name
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

// Generate unique ID
function generateId(): string {
  return `prod-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}

// Get all products for a specific vendor (mock + stored)
export function getProductsByVendorId(vendorId: string): Product[] {
  const storedProducts = getStoredProducts()
  const vendorMockProducts = mockProducts.filter((p) => p.vendorId === vendorId)
  const vendorStoredProducts = storedProducts.filter(
    (p) => p.vendorId === vendorId
  )

  return [...vendorMockProducts, ...vendorStoredProducts]
    .map(getProductWithRelations)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

// Get a single product by ID (including stored products)
export function getVendorProductById(id: string): Product | undefined {
  const storedProducts = getStoredProducts()

  // First check stored products
  const storedProduct = storedProducts.find((p) => p.id === id)
  if (storedProduct) {
    return getProductWithRelations(storedProduct)
  }

  // Then check mock products
  const mockProduct = mockProducts.find((p) => p.id === id)
  if (mockProduct) {
    return getProductWithRelations(mockProduct)
  }

  return undefined
}

// Create a new product
export function createProduct(
  data: Omit<Product, 'id' | 'slug' | 'createdAt'>,
  vendorId: string
): Product {
  const storedProducts = getStoredProducts()

  const newProduct: Product = {
    ...data,
    id: generateId(),
    slug: generateSlug(data.name),
    vendorId,
    createdAt: new Date().toISOString(),
  }

  storedProducts.push(newProduct)
  saveStoredProducts(storedProducts)

  return getProductWithRelations(newProduct)
}

// Update an existing product
export function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'vendorId' | 'createdAt'>>,
  vendorId: string
): Product | null {
  const storedProducts = getStoredProducts()

  // Check if it's a stored product that belongs to this vendor
  const productIndex = storedProducts.findIndex(
    (p) => p.id === id && p.vendorId === vendorId
  )

  if (productIndex === -1) {
    // Check if it's a mock product - we can't edit mock products
    const mockProduct = mockProducts.find(
      (p) => p.id === id && p.vendorId === vendorId
    )
    if (mockProduct) {
      // Create a copy in stored products with updates
      const updatedProduct: Product = {
        ...mockProduct,
        ...data,
        slug: data.name ? generateSlug(data.name) : mockProduct.slug,
      }
      storedProducts.push(updatedProduct)
      saveStoredProducts(storedProducts)
      return getProductWithRelations(updatedProduct)
    }
    return null
  }

  // Update stored product
  const updatedProduct: Product = {
    ...storedProducts[productIndex],
    ...data,
    slug: data.name
      ? generateSlug(data.name)
      : storedProducts[productIndex].slug,
  }

  storedProducts[productIndex] = updatedProduct
  saveStoredProducts(storedProducts)

  return getProductWithRelations(updatedProduct)
}

// Delete a product
export function deleteProduct(id: string, vendorId: string): boolean {
  const storedProducts = getStoredProducts()

  // Find the product index
  const productIndex = storedProducts.findIndex(
    (p) => p.id === id && p.vendorId === vendorId
  )

  if (productIndex === -1) {
    // Can't delete mock products
    return false
  }

  storedProducts.splice(productIndex, 1)
  saveStoredProducts(storedProducts)

  return true
}

// Check if a product is editable (only stored products are editable)
export function isProductEditable(id: string): boolean {
  const storedProducts = getStoredProducts()
  return storedProducts.some((p) => p.id === id)
}

// Get vendor product stats
export function getVendorProductStats(vendorId: string): {
  total: number
  inStock: number
  limited: number
  outOfStock: number
} {
  const products = getProductsByVendorId(vendorId)

  return {
    total: products.length,
    inStock: products.filter((p) => p.availability === 'in_stock').length,
    limited: products.filter((p) => p.availability === 'limited').length,
    outOfStock: products.filter((p) => p.availability === 'out_of_stock').length,
  }
}
