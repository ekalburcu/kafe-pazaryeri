import { Category } from '@/types'

export const defaultCategories: Category[] = [
  {
    id: 'coffee',
    name: 'Kahve & İçecek',
    slug: 'kahve-icecek',
    productCount: 45,
  },
  { id: 'equipment', name: 'Ekipman', slug: 'ekipman', productCount: 32 },
  { id: 'packaging', name: 'Ambalaj', slug: 'ambalaj', productCount: 58 },
  { id: 'cleaning', name: 'Temizlik', slug: 'temizlik', productCount: 24 },
  { id: 'furniture', name: 'Mobilya', slug: 'mobilya', productCount: 18 },
  { id: 'dairy', name: 'Süt Ürünleri', slug: 'sut-urunleri', productCount: 15 },
]

const CATEGORIES_STORAGE_KEY = 'kafe-market-categories'

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

// Load categories from localStorage
function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Category[]
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
  return []
}

// Save categories to localStorage
function saveCategories(cats: Category[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats))
  } catch (error) {
    console.error('Failed to save categories:', error)
  }
}

// Get all categories (default + stored)
export function getAllCategories(): Category[] {
  const stored = getStoredCategories()
  if (stored.length > 0) {
    return stored
  }
  return defaultCategories
}

// For backward compatibility
export const categories = defaultCategories

export function getCategoryById(id: string): Category | undefined {
  return getAllCategories().find((c) => c.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find((c) => c.slug === slug)
}

// Create a new category
export function createCategory(
  data: Omit<Category, 'id' | 'slug' | 'productCount'>
): Category {
  const allCats = getAllCategories()

  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    name: data.name,
    slug: generateSlug(data.name),
    parentId: data.parentId,
    productCount: 0,
  }

  const updatedCats = [...allCats, newCategory]
  saveCategories(updatedCats)

  return newCategory
}

// Update a category
export function updateCategory(
  id: string,
  data: Partial<Omit<Category, 'id' | 'slug'>>
): Category | null {
  const allCats = getAllCategories()
  const index = allCats.findIndex((c) => c.id === id)

  if (index === -1) return null

  const updated: Category = {
    ...allCats[index],
    ...data,
    slug: data.name ? generateSlug(data.name) : allCats[index].slug,
  }

  allCats[index] = updated
  saveCategories(allCats)

  return updated
}

// Delete a category
export function deleteCategory(id: string): boolean {
  const allCats = getAllCategories()
  const index = allCats.findIndex((c) => c.id === id)

  if (index === -1) return false

  // Don't allow deleting default categories
  if (defaultCategories.some((c) => c.id === id)) {
    return false
  }

  allCats.splice(index, 1)
  saveCategories(allCats)

  return true
}

// Get category stats
export function getCategoryStats(): {
  total: number
  withProducts: number
  empty: number
} {
  const allCats = getAllCategories()
  return {
    total: allCats.length,
    withProducts: allCats.filter((c) => (c.productCount || 0) > 0).length,
    empty: allCats.filter((c) => (c.productCount || 0) === 0).length,
  }
}
