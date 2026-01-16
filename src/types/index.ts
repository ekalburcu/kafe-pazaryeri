export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  productCount?: number
}

export type VendorStatus = 'pending' | 'approved' | 'suspended'

export interface Vendor {
  id: string
  name: string
  slug: string
  rating?: number
  city?: string
  minOrder?: number
  deliveryRegions?: string[]
  verified?: boolean
  description?: string
  productCount?: number
  status?: VendorStatus
  createdAt?: string
}

export interface ProductSpec {
  key: string
  value: string
}

export interface Product {
  id: string
  name: string
  slug: string
  categoryId: string
  category?: Category
  brand: string
  priceMin: number
  priceMax: number
  vendorId: string
  vendor?: Vendor
  tags: string[]
  images: string[]
  moq: number // Minimum Order Quantity
  leadTimeDays: number
  availability: 'in_stock' | 'limited' | 'pre_order' | 'out_of_stock'
  description: string
  specs: ProductSpec[]
  featured?: boolean
  isActive?: boolean // For admin moderation
  flagged?: boolean // For admin review
  flagReason?: string
  createdAt: string
}

export interface FilterParams {
  category?: string
  brand?: string
  vendor?: string
  minPrice?: number
  maxPrice?: number
  availability?: string
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
  page?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Cart Types
export interface CartItem {
  productId: string
  quantity: number
  note?: string
  product?: Product
}

export interface Cart {
  items: CartItem[]
  updatedAt: string
}

// Request Types
export type RequestStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'answered'
  | 'completed'
  | 'cancelled'

export interface RequestItem {
  productId: string
  productName: string
  productBrand: string
  vendorId: string
  vendorName: string
  quantity: number
  priceMin: number
  priceMax: number
  note?: string
}

export interface GuestInfo {
  companyName: string
  contactName: string
  email: string
  phone: string
  taxNumber?: string
}

export interface DeliveryInfo {
  address: string
  city: string
  district: string
  postalCode?: string
  preferredDate?: string
  notes?: string
}

export interface VendorResponse {
  vendorId: string
  vendorName: string
  unitPrice: number
  deliveryDays: number
  message?: string
  validUntil?: string
  respondedAt: string
}

export interface OrderRequest {
  id: string
  userId?: string
  guestInfo: GuestInfo
  deliveryInfo: DeliveryInfo
  items: RequestItem[]
  status: RequestStatus
  totalEstimate: {
    min: number
    max: number
  }
  vendorResponses?: VendorResponse[]
  createdAt: string
  updatedAt: string
}

// User & Auth Types
export type UserRole = 'cafe' | 'vendor' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  companyName?: string
  phone?: string
  city?: string
  vendorId?: string // For vendor users
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Favorites Types
export interface UserFavorites {
  userId: string
  productIds: string[]
  vendorIds: string[]
  updatedAt: string
}

// Bundle (Kafe Paketi) Types
export interface BundleItem {
  productId: string
  quantity: number
  product?: Product
}

export interface Bundle {
  id: string
  name: string
  slug: string
  description: string
  image: string
  items: BundleItem[]
  priceMin: number
  priceMax: number
  featured?: boolean
  category: 'starter' | 'espresso' | 'filter' | 'bakery' | 'supplies'
  createdAt: string
}
