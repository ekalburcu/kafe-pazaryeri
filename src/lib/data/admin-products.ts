import { Product } from '@/types'
import { products as mockProducts, getProductWithRelations } from './products'
import { supabase, supabaseEnabled } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────

interface ProductModeration {
  isActive: boolean
  flagged: boolean
  flagReason?: string
}

// ─── Slug helper ─────────────────────────────────────────────────

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

// ─── Apply moderation ─────────────────────────────────────────────

function applyModeration(
  product: Product,
  overrides: Record<string, ProductModeration>
): Product {
  const mod = overrides[product.id]
  if (mod) {
    return {
      ...product,
      isActive: mod.isActive,
      flagged: mod.flagged,
      flagReason: mod.flagReason,
    }
  }
  return {
    ...product,
    isActive: product.isActive !== false,
    flagged: product.flagged || false,
  }
}

// ─── Supabase helpers ─────────────────────────────────────────────

async function fetchOverridesFromSupabase(): Promise<Record<string, ProductModeration>> {
  try {
    const { data, error } = await supabase
      .from('product_overrides')
      .select('id, is_active, flagged, flag_reason')
    if (error) throw error
    const result: Record<string, ProductModeration> = {}
    for (const row of data ?? []) {
      result[row.id] = {
        isActive: row.is_active,
        flagged: row.flagged,
        flagReason: row.flag_reason ?? undefined,
      }
    }
    return result
  } catch (err) {
    console.error('Supabase: failed to fetch product overrides:', err)
    return {}
  }
}

async function fetchAdminProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('admin_products')
      .select('data')
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data ?? []).map((row) => row.data as Product)
  } catch (err) {
    console.error('Supabase: failed to fetch admin products:', err)
    return []
  }
}

// ─── localStorage fallbacks ───────────────────────────────────────

const PRODUCT_MODERATION_KEY = 'kafe-market-product-moderation'
const ADMIN_PRODUCTS_KEY = 'kafe-market-admin-products'

function getLocalOverrides(): Record<string, ProductModeration> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(PRODUCT_MODERATION_KEY)
    return stored ? (JSON.parse(stored) as Record<string, ProductModeration>) : {}
  } catch {
    return {}
  }
}

function saveLocalOverrides(overrides: Record<string, ProductModeration>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PRODUCT_MODERATION_KEY, JSON.stringify(overrides))
  } catch {
    // ignore
  }
}

function getLocalAdminProducts(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(ADMIN_PRODUCTS_KEY)
    return stored ? (JSON.parse(stored) as Product[]) : []
  } catch {
    return []
  }
}

function saveLocalAdminProducts(prods: Product[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(prods))
  } catch {
    // ignore
  }
}

// ─── Overrides: read / write ──────────────────────────────────────

async function getModerationOverrides(): Promise<Record<string, ProductModeration>> {
  if (supabaseEnabled) return fetchOverridesFromSupabase()
  return getLocalOverrides()
}

async function upsertOverride(id: string, patch: Partial<ProductModeration>): Promise<void> {
  if (supabaseEnabled) {
    // Fetch current row to merge
    const current = (await fetchOverridesFromSupabase())[id] ?? {
      isActive: true,
      flagged: false,
    }
    const merged = { ...current, ...patch }
    const { error } = await supabase.from('product_overrides').upsert(
      {
        id,
        is_active: merged.isActive,
        flagged: merged.flagged,
        flag_reason: merged.flagReason ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    if (error) console.error('Supabase: failed to upsert override:', error)
  } else {
    const overrides = getLocalOverrides()
    const current = overrides[id] ?? { isActive: true, flagged: false }
    overrides[id] = { ...current, ...patch }
    saveLocalOverrides(overrides)
  }
}

// ─── Admin products: read / write ─────────────────────────────────

async function getAdminStoredProducts(): Promise<Product[]> {
  if (supabaseEnabled) return fetchAdminProductsFromSupabase()
  return getLocalAdminProducts()
}

// ─── Public API ───────────────────────────────────────────────────

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const [adminStored, overrides] = await Promise.all([
    getAdminStoredProducts(),
    getModerationOverrides(),
  ])
  return [...mockProducts, ...adminStored].map((p) =>
    applyModeration(getProductWithRelations(p), overrides)
  )
}

export async function hideProduct(id: string): Promise<void> {
  await upsertOverride(id, { isActive: false })
}

export async function showProduct(id: string): Promise<void> {
  await upsertOverride(id, { isActive: true })
}

export async function flagProduct(id: string, reason: string): Promise<void> {
  await upsertOverride(id, { flagged: true, flagReason: reason })
}

export async function unflagProduct(id: string): Promise<void> {
  await upsertOverride(id, { flagged: false, flagReason: undefined })
}

export async function createAdminProduct(
  data: Omit<Product, 'id' | 'slug' | 'createdAt'>
): Promise<Product> {
  const newProduct: Product = {
    ...data,
    id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    slug: generateSlug(data.name),
    createdAt: new Date().toISOString(),
  }

  if (supabaseEnabled) {
    const { error } = await supabase
      .from('admin_products')
      .insert({ id: newProduct.id, data: newProduct })
    if (error) console.error('Supabase: failed to create admin product:', error)
  } else {
    const prods = getLocalAdminProducts()
    prods.push(newProduct)
    saveLocalAdminProducts(prods)
  }

  return getProductWithRelations(newProduct)
}

export async function updateAdminProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<Product | null> {
  const adminProducts = await getAdminStoredProducts()
  const existing = adminProducts.find((p) => p.id === id)

  if (existing) {
    const updated: Product = {
      ...existing,
      ...updates,
      slug: updates.name ? generateSlug(updates.name) : existing.slug,
    }
    if (supabaseEnabled) {
      const { error } = await supabase
        .from('admin_products')
        .update({ data: updated, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) console.error('Supabase: failed to update admin product:', error)
    } else {
      const prods = getLocalAdminProducts()
      const idx = prods.findIndex((p) => p.id === id)
      if (idx !== -1) {
        prods[idx] = updated
        saveLocalAdminProducts(prods)
      }
    }
    return getProductWithRelations(updated)
  }

  // Hardcoded product: clone into admin storage and hide original
  const hardcoded = mockProducts.find((p) => p.id === id)
  if (hardcoded) {
    const updated: Product = {
      ...hardcoded,
      ...updates,
      slug: updates.name ? generateSlug(updates.name) : hardcoded.slug,
    }
    if (supabaseEnabled) {
      const { error } = await supabase
        .from('admin_products')
        .insert({ id: updated.id, data: updated })
      if (error) console.error('Supabase: failed to clone hardcoded product:', error)
    } else {
      const prods = getLocalAdminProducts()
      prods.push(updated)
      saveLocalAdminProducts(prods)
    }
    await hideProduct(id)
    return getProductWithRelations(updated)
  }

  return null
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const adminProducts = await getAdminStoredProducts()
  const isAdminProduct = adminProducts.some((p) => p.id === id)

  if (isAdminProduct) {
    if (supabaseEnabled) {
      const { error } = await supabase.from('admin_products').delete().eq('id', id)
      if (error) {
        console.error('Supabase: failed to delete admin product:', error)
        return false
      }
    } else {
      const prods = getLocalAdminProducts().filter((p) => p.id !== id)
      saveLocalAdminProducts(prods)
    }
    return true
  }

  // Hardcoded product: hide via moderation
  const hardcoded = mockProducts.find((p) => p.id === id)
  if (hardcoded) {
    await hideProduct(id)
    return true
  }

  return false
}

export async function getProductStats(): Promise<{
  total: number
  active: number
  hidden: number
  flagged: number
}> {
  const allProducts = await getAllProductsForAdmin()
  return {
    total: allProducts.length,
    active: allProducts.filter((p) => p.isActive !== false).length,
    hidden: allProducts.filter((p) => p.isActive === false).length,
    flagged: allProducts.filter((p) => p.flagged).length,
  }
}
