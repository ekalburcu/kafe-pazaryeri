import { OrderRequest } from '@/types'

// In-memory storage for requests (MVP)
// In production, this would be a database
const requests: Map<string, OrderRequest> = new Map()

const REQUESTS_STORAGE_KEY = 'kafe-market-requests'

// Load requests from localStorage on init (client-side only)
function loadFromStorage(): void {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as OrderRequest[]
      parsed.forEach((req) => requests.set(req.id, req))
    }
  } catch (error) {
    console.error('Failed to load requests from localStorage:', error)
  }
}

// Save requests to localStorage
function saveToStorage(): void {
  if (typeof window === 'undefined') return

  try {
    const allRequests = Array.from(requests.values())
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(allRequests))
  } catch (error) {
    console.error('Failed to save requests to localStorage:', error)
  }
}

// Generate unique ID
function generateId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `REQ-${timestamp}-${random}`.toUpperCase()
}

// CRUD Operations
export function createRequest(
  request: Omit<OrderRequest, 'id' | 'createdAt' | 'updatedAt'>
): OrderRequest {
  loadFromStorage()

  const newRequest: OrderRequest = {
    ...request,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  requests.set(newRequest.id, newRequest)
  saveToStorage()

  return newRequest
}

export function getRequestById(id: string): OrderRequest | undefined {
  loadFromStorage()
  return requests.get(id)
}

export function getAllRequests(): OrderRequest[] {
  loadFromStorage()
  return Array.from(requests.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function updateRequestStatus(
  id: string,
  status: OrderRequest['status']
): OrderRequest | undefined {
  loadFromStorage()

  const request = requests.get(id)
  if (!request) return undefined

  const updated: OrderRequest = {
    ...request,
    status,
    updatedAt: new Date().toISOString(),
  }

  requests.set(id, updated)
  saveToStorage()

  return updated
}

export function deleteRequest(id: string): boolean {
  loadFromStorage()

  const deleted = requests.delete(id)
  if (deleted) {
    saveToStorage()
  }

  return deleted
}

export function getRequestsByUserId(userId: string): OrderRequest[] {
  loadFromStorage()
  return Array.from(requests.values())
    .filter((req) => req.userId === userId)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

// Get requests that contain products from a specific vendor
export function getRequestsByVendorId(vendorId: string): OrderRequest[] {
  loadFromStorage()
  return Array.from(requests.values())
    .filter((req) => req.items.some((item) => item.vendorId === vendorId))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

// Add vendor response to a request
export function addVendorResponse(
  requestId: string,
  response: {
    vendorId: string
    vendorName: string
    unitPrice: number
    deliveryDays: number
    message?: string
    validUntil?: string
  }
): OrderRequest | undefined {
  loadFromStorage()

  const request = requests.get(requestId)
  if (!request) return undefined

  const vendorResponse = {
    ...response,
    respondedAt: new Date().toISOString(),
  }

  // Add or update vendor response
  const existingResponses = request.vendorResponses || []
  const existingIndex = existingResponses.findIndex(
    (r) => r.vendorId === response.vendorId
  )

  let newResponses
  if (existingIndex >= 0) {
    newResponses = [...existingResponses]
    newResponses[existingIndex] = vendorResponse
  } else {
    newResponses = [...existingResponses, vendorResponse]
  }

  const updated: OrderRequest = {
    ...request,
    vendorResponses: newResponses,
    status: 'answered',
    updatedAt: new Date().toISOString(),
  }

  requests.set(requestId, updated)
  saveToStorage()

  return updated
}
