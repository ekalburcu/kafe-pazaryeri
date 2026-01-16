import { Bundle, BundleItem, Product } from '@/types'
import { getProductById } from './products'

// Sample bundles
export const defaultBundles: Bundle[] = [
  {
    id: 'espresso-bar-starter',
    name: 'Espresso Bar Başlangıç Seti',
    slug: 'espresso-bar-baslangic-seti',
    description:
      'Yeni açılan kafeler için ideal başlangıç seti. Kaliteli espresso çekirdeği, bardaklar ve temel ekipmanları içerir.',
    image: '/images/bundles/espresso-starter.jpg',
    items: [
      { productId: 'premium-arabica-1kg', quantity: 5 },
      { productId: 'espresso-fincan-6li', quantity: 10 },
      { productId: 'latte-bardak-350ml', quantity: 20 },
      { productId: 'kahve-kasigi-paslanmaz', quantity: 5 },
    ],
    priceMin: 2500,
    priceMax: 3500,
    featured: true,
    category: 'starter',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'filter-kahve-setup',
    name: 'Filtre Kahve Köşesi Paketi',
    slug: 'filtre-kahve-kosesi-paketi',
    description:
      'Filtre kahve servisi için gereken tüm malzemeler. V60, chemex ve french press seçenekleri.',
    image: '/images/bundles/filter-setup.jpg',
    items: [
      { productId: 'filter-blend-250g', quantity: 10 },
      { productId: 'v60-filtre-kagidi', quantity: 5 },
      { productId: 'cam-sürahi-600ml', quantity: 3 },
    ],
    priceMin: 1200,
    priceMax: 1800,
    featured: true,
    category: 'filter',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'bakery-essentials',
    name: 'Pastane Temel Malzeme Paketi',
    slug: 'pastane-temel-malzeme-paketi',
    description:
      'Taze pasta ve tatlı servisi için gerekli ambalaj ve sunum malzemeleri.',
    image: '/images/bundles/bakery-essentials.jpg',
    items: [
      { productId: 'pasta-kutusu-20cm', quantity: 50 },
      { productId: 'karton-tabak-18cm', quantity: 200 },
      { productId: 'kagit-pecete-33cm', quantity: 10 },
    ],
    priceMin: 800,
    priceMax: 1100,
    featured: false,
    category: 'bakery',
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 'takeaway-bundle',
    name: 'Paket Servis Seti',
    slug: 'paket-servis-seti',
    description:
      'Paket servis ve take-away için bardak, kapak ve taşıma malzemeleri.',
    image: '/images/bundles/takeaway-bundle.jpg',
    items: [
      { productId: 'kraft-bardak-12oz', quantity: 10 },
      { productId: 'bardak-kapagi-90mm', quantity: 10 },
      { productId: 'bardak-tasiyici-2li', quantity: 5 },
      { productId: 'kahve-karton-kol', quantity: 10 },
    ],
    priceMin: 1500,
    priceMax: 2000,
    featured: true,
    category: 'supplies',
    createdAt: '2024-01-04T00:00:00Z',
  },
  {
    id: 'cold-brew-kit',
    name: 'Soğuk Kahve Hazırlık Seti',
    slug: 'soguk-kahve-hazirlik-seti',
    description:
      'Yaz sezonu için cold brew ve buzlu kahve servisi malzemeleri.',
    image: '/images/bundles/cold-brew-kit.jpg',
    items: [
      { productId: 'cold-brew-blend-1kg', quantity: 3 },
      { productId: 'buzlu-kahve-bardak-500ml', quantity: 20 },
      { productId: 'pipet-kompostlanabilir', quantity: 10 },
    ],
    priceMin: 900,
    priceMax: 1300,
    featured: false,
    category: 'espresso',
    createdAt: '2024-01-05T00:00:00Z',
  },
]

const BUNDLES_STORAGE_KEY = 'kafemarket_bundles'

// Get bundles from localStorage or default
function getBundlesFromStorage(): Bundle[] {
  if (typeof window === 'undefined') {
    return defaultBundles
  }

  const stored = localStorage.getItem(BUNDLES_STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  return defaultBundles
}

// Get all bundles
export function getAllBundles(): Bundle[] {
  return getBundlesFromStorage()
}

// Get featured bundles
export function getFeaturedBundles(): Bundle[] {
  return getBundlesFromStorage().filter((b) => b.featured)
}

// Get bundle by ID
export function getBundleById(id: string): Bundle | null {
  const bundles = getBundlesFromStorage()
  return bundles.find((b) => b.id === id) || null
}

// Get bundle by slug
export function getBundleBySlug(slug: string): Bundle | null {
  const bundles = getBundlesFromStorage()
  return bundles.find((b) => b.slug === slug) || null
}

// Get bundles by category
export function getBundlesByCategory(
  category: Bundle['category']
): Bundle[] {
  return getBundlesFromStorage().filter((b) => b.category === category)
}

// Get bundle with populated products
export function getBundleWithProducts(bundleId: string): Bundle | null {
  const bundle = getBundleById(bundleId)
  if (!bundle) return null

  const itemsWithProducts: BundleItem[] = bundle.items.map((item) => ({
    ...item,
    product: getProductById(item.productId) || undefined,
  }))

  return {
    ...bundle,
    items: itemsWithProducts,
  }
}

// Calculate bundle price range based on actual products
export function calculateBundlePrice(bundle: Bundle): {
  min: number
  max: number
} {
  let minTotal = 0
  let maxTotal = 0

  bundle.items.forEach((item) => {
    const product = getProductById(item.productId)
    if (product) {
      minTotal += product.priceMin * item.quantity
      maxTotal += product.priceMax * item.quantity
    }
  })

  return { min: minTotal, max: maxTotal }
}

// Get bundle categories for filtering
export function getBundleCategories(): {
  value: Bundle['category']
  label: string
}[] {
  return [
    { value: 'starter', label: 'Başlangıç Setleri' },
    { value: 'espresso', label: 'Espresso' },
    { value: 'filter', label: 'Filtre Kahve' },
    { value: 'bakery', label: 'Pastane' },
    { value: 'supplies', label: 'Sarf Malzemeler' },
  ]
}

// Admin functions - Create bundle
export function createBundle(
  data: Omit<Bundle, 'id' | 'slug' | 'createdAt'>
): Bundle {
  const bundles = getBundlesFromStorage()

  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const newBundle: Bundle = {
    ...data,
    id: `bundle-${Date.now()}`,
    slug,
    createdAt: new Date().toISOString(),
  }

  bundles.push(newBundle)

  if (typeof window !== 'undefined') {
    localStorage.setItem(BUNDLES_STORAGE_KEY, JSON.stringify(bundles))
  }

  return newBundle
}

// Update bundle
export function updateBundle(
  id: string,
  data: Partial<Bundle>
): Bundle | null {
  const bundles = getBundlesFromStorage()
  const index = bundles.findIndex((b) => b.id === id)

  if (index === -1) return null

  bundles[index] = { ...bundles[index], ...data }

  if (typeof window !== 'undefined') {
    localStorage.setItem(BUNDLES_STORAGE_KEY, JSON.stringify(bundles))
  }

  return bundles[index]
}

// Delete bundle
export function deleteBundle(id: string): boolean {
  const bundles = getBundlesFromStorage()
  const filtered = bundles.filter((b) => b.id !== id)

  if (filtered.length === bundles.length) return false

  if (typeof window !== 'undefined') {
    localStorage.setItem(BUNDLES_STORAGE_KEY, JSON.stringify(filtered))
  }

  return true
}
