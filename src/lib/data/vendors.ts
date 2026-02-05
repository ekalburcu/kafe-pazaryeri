import { Vendor, VendorStatus } from '@/types'

export const vendors: Vendor[] = [
  {
    id: 'kahve-dunyasi',
    name: 'Kahve Dünyası',
    slug: 'kahve-dunyasi',
    rating: 4.8,
    city: 'İstanbul',
    minOrder: 500,
    deliveryRegions: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'],
    verified: true,
    description: 'Premium kahve çekirdekleri ve öğütülmüş kahveler',
    productCount: 45,
    status: 'approved',
    createdAt: '2024-01-01',
  },
  {
    id: 'ekipman-pro',
    name: 'Ekipman Pro',
    slug: 'ekipman-pro',
    rating: 4.6,
    city: 'Ankara',
    minOrder: 1000,
    deliveryRegions: ['Türkiye Geneli'],
    verified: true,
    description: 'Profesyonel kafe ekipmanları ve servis',
    productCount: 120,
    status: 'approved',
    createdAt: '2024-01-05',
  },
  {
    id: 'ambalaj-market',
    name: 'Ambalaj Market',
    slug: 'ambalaj-market',
    rating: 4.5,
    city: 'İzmir',
    minOrder: 250,
    deliveryRegions: ['Türkiye Geneli'],
    verified: true,
    description: 'Her türlü kafe ambalaj malzemesi',
    productCount: 200,
    status: 'approved',
    createdAt: '2024-01-10',
  },
  {
    id: 'temizlik-pro',
    name: 'Temizlik Pro',
    slug: 'temizlik-pro',
    rating: 4.3,
    city: 'Bursa',
    minOrder: 300,
    deliveryRegions: ['Marmara', 'İç Anadolu'],
    verified: false,
    description: 'Profesyonel temizlik malzemeleri',
    productCount: 80,
    status: 'pending',
    createdAt: '2024-01-12',
  },
  {
    id: 'sut-deposu',
    name: 'Süt Deposu',
    slug: 'sut-deposu',
    rating: 4.7,
    city: 'İstanbul',
    minOrder: 200,
    deliveryRegions: ['İstanbul', 'Kocaeli', 'Sakarya'],
    verified: true,
    description: 'Taze süt ve süt ürünleri tedarikçisi',
    productCount: 25,
    status: 'approved',
    createdAt: '2024-01-08',
  },
  {
    id: 'mobilya-craft',
    name: 'Mobilya Craft',
    slug: 'mobilya-craft',
    rating: 4.4,
    city: 'Kayseri',
    minOrder: 2000,
    deliveryRegions: ['Türkiye Geneli'],
    verified: true,
    description: 'Kafe ve restoran mobilyaları üreticisi',
    productCount: 45,
    status: 'approved',
    createdAt: '2024-01-03',
  },
  {
    id: 'top-roasters',
    name: 'Top Roasters',
    slug: 'top-roasters',
    rating: 4.9,
    city: 'İstanbul',
    minOrder: 250,
    deliveryRegions: ['Türkiye Geneli'],
    verified: true,
    description: 'Premium kahve ve çay çekirdeği tedarikçisi. Ataşehir, İstanbul.',
    productCount: 35,
    status: 'approved',
    createdAt: '2024-01-02',
  },
]

const VENDORS_STORAGE_KEY = 'kafe-market-vendors-status'

// Load vendor status overrides from localStorage
function getVendorStatusOverrides(): Record<string, VendorStatus> {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(VENDORS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Record<string, VendorStatus>
    }
  } catch (error) {
    console.error('Failed to load vendor status:', error)
  }
  return {}
}

// Save vendor status overrides to localStorage
function saveVendorStatusOverrides(
  overrides: Record<string, VendorStatus>
): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(overrides))
  } catch (error) {
    console.error('Failed to save vendor status:', error)
  }
}

// Get vendor with status override applied
function applyStatusOverride(vendor: Vendor): Vendor {
  const overrides = getVendorStatusOverrides()
  if (overrides[vendor.id]) {
    return { ...vendor, status: overrides[vendor.id] }
  }
  return vendor
}

export function getVendorById(id: string): Vendor | undefined {
  const vendor = vendors.find((v) => v.id === id)
  if (vendor) {
    return applyStatusOverride(vendor)
  }
  return undefined
}

export function getVendorBySlug(slug: string): Vendor | undefined {
  const vendor = vendors.find((v) => v.slug === slug)
  if (vendor) {
    return applyStatusOverride(vendor)
  }
  return undefined
}

// Get all vendors with status overrides applied
export function getAllVendors(): Vendor[] {
  return vendors.map(applyStatusOverride)
}

// Get vendors by status
export function getVendorsByStatus(status: VendorStatus): Vendor[] {
  return getAllVendors().filter((v) => v.status === status)
}

// Update vendor status (admin function)
export function updateVendorStatus(
  vendorId: string,
  status: VendorStatus
): Vendor | null {
  const vendor = vendors.find((v) => v.id === vendorId)
  if (!vendor) return null

  const overrides = getVendorStatusOverrides()
  overrides[vendorId] = status
  saveVendorStatusOverrides(overrides)

  return { ...vendor, status }
}

// Get vendor stats for admin dashboard
export function getVendorStats(): {
  total: number
  approved: number
  pending: number
  suspended: number
} {
  const allVendors = getAllVendors()
  return {
    total: allVendors.length,
    approved: allVendors.filter((v) => v.status === 'approved').length,
    pending: allVendors.filter((v) => v.status === 'pending').length,
    suspended: allVendors.filter((v) => v.status === 'suspended').length,
  }
}

// Check if vendor is active (approved)
export function isVendorActive(vendorId: string): boolean {
  const vendor = getVendorById(vendorId)
  return vendor?.status === 'approved'
}
