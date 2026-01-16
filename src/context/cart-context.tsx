'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { Cart, CartItem, Product, OrderRequest, Bundle } from '@/types'
import { getProductById } from '@/lib/data'

const CART_STORAGE_KEY = 'kafe-market-cart'

interface CartContextType {
  cart: Cart
  isLoading: boolean
  addItem: (productId: string, quantity: number, note?: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateNote: (productId: string, note: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getItemCount: () => number
  getCartWithProducts: () => CartItem[]
  getSubtotal: () => { min: number; max: number }
  reorderFromRequest: (request: OrderRequest) => void
  addBundleToCart: (bundle: Bundle) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const emptyCart: Cart = {
  items: [],
  updatedAt: new Date().toISOString(),
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [isLoading, setIsLoading] = useState(true)

  // localStorage'dan cart'ı yükle
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Cart
        setCart(parsed)
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cart değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }
  }, [cart, isLoading])

  const addItem = useCallback(
    (productId: string, quantity: number, note?: string) => {
      setCart((prev) => {
        const existingIndex = prev.items.findIndex(
          (item) => item.productId === productId
        )

        let newItems: CartItem[]
        if (existingIndex >= 0) {
          // Mevcut ürünün miktarını artır
          newItems = prev.items.map((item, index) =>
            index === existingIndex
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  note: note || item.note,
                }
              : item
          )
        } else {
          // Yeni ürün ekle
          newItems = [...prev.items, { productId, quantity, note }]
        }

        return {
          items: newItems,
          updatedAt: new Date().toISOString(),
        }
      })
    },
    []
  )

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setCart((prev) => ({
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const updateNote = useCallback((productId: string, note: string) => {
    setCart((prev) => ({
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, note } : item
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => ({
      items: prev.items.filter((item) => item.productId !== productId),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      updatedAt: new Date().toISOString(),
    })
  }, [])

  const getItemCount = useCallback(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }, [cart.items])

  const getCartWithProducts = useCallback(() => {
    return cart.items
      .map((item) => ({
        ...item,
        product: getProductById(item.productId),
      }))
      .filter((item) => item.product !== undefined) as CartItem[]
  }, [cart.items])

  const getSubtotal = useCallback(() => {
    const cartWithProducts = getCartWithProducts()
    return cartWithProducts.reduce(
      (acc, item) => {
        if (item.product) {
          return {
            min: acc.min + item.product.priceMin * item.quantity,
            max: acc.max + item.product.priceMax * item.quantity,
          }
        }
        return acc
      },
      { min: 0, max: 0 }
    )
  }, [getCartWithProducts])

  // Reorder: Copy items from a previous request to cart
  const reorderFromRequest = useCallback((request: OrderRequest) => {
    request.items.forEach((item) => {
      addItem(item.productId, item.quantity, item.note)
    })
  }, [addItem])

  // Add all items from a bundle to cart
  const addBundleToCart = useCallback((bundle: Bundle) => {
    bundle.items.forEach((item) => {
      addItem(item.productId, item.quantity)
    })
  }, [addItem])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateQuantity,
        updateNote,
        removeItem,
        clearCart,
        getItemCount,
        getCartWithProducts,
        getSubtotal,
        reorderFromRequest,
        addBundleToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
