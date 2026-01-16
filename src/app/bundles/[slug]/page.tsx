'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  ShoppingCart,
  ArrowLeft,
  Check,
  Plus,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { useCart } from '@/context/cart-context'
import {
  getBundleBySlug,
  getBundleWithProducts,
  getBundleCategories,
} from '@/lib/data/bundles'
import { Bundle, BundleItem } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface SelectedItem extends BundleItem {
  selected: boolean
  customQuantity: number
}

export default function BundleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, addBundleToCart } = useCart()
  const [bundle, setBundle] = useState<Bundle | null>(null)
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const slug = params?.slug as string

  useEffect(() => {
    if (slug) {
      const bundleData = getBundleWithProducts(
        getBundleBySlug(slug)?.id || ''
      )
      if (bundleData) {
        setBundle(bundleData)
        setSelectedItems(
          bundleData.items.map((item) => ({
            ...item,
            selected: true,
            customQuantity: item.quantity,
          }))
        )
      }
      setIsLoading(false)
    }
  }, [slug])

  const categories = getBundleCategories()

  const handleToggleItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    )
  }

  const handleQuantityChange = (productId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              customQuantity: Math.max(
                1,
                item.customQuantity + delta
              ),
            }
          : item
      )
    )
  }

  const calculateCustomPrice = () => {
    let min = 0
    let max = 0
    selectedItems
      .filter((item) => item.selected && item.product)
      .forEach((item) => {
        if (item.product) {
          min += item.product.priceMin * item.customQuantity
          max += item.product.priceMax * item.customQuantity
        }
      })
    return { min, max }
  }

  const handleAddAllToCart = () => {
    if (!bundle) return
    addBundleToCart(bundle)
    toast.success(`${bundle.name} sepete eklendi (${bundle.items.length} ürün)`)
  }

  const handleAddSelectedToCart = () => {
    const itemsToAdd = selectedItems.filter(
      (item) => item.selected && item.product
    )
    if (itemsToAdd.length === 0) {
      toast.error('En az bir ürün seçmelisiniz')
      return
    }
    itemsToAdd.forEach((item) => {
      addItem(item.productId, item.customQuantity)
    })
    toast.success(`${itemsToAdd.length} ürün sepete eklendi`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="h-96 animate-pulse bg-muted rounded-lg" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Paket bulunamadı</h3>
              <Button asChild className="mt-4">
                <Link href="/bundles">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Paketlere Dön
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const customPrice = calculateCustomPrice()
  const selectedCount = selectedItems.filter((i) => i.selected).length
  const categoryLabel = categories.find((c) => c.value === bundle.category)
    ?.label

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/bundles" className="hover:text-foreground">
            Paketler
          </Link>
          <span>/</span>
          {categoryLabel && (
            <>
              <span>{categoryLabel}</span>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{bundle.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Bundle Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{categoryLabel}</Badge>
                  {bundle.featured && (
                    <Badge variant="secondary">Popüler</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{bundle.name}</h1>
                <p className="text-muted-foreground">{bundle.description}</p>
              </div>
              <div className="aspect-square w-32 relative bg-gradient-to-br from-muted to-muted/50 rounded-lg">
                {bundle.image && !bundle.image.includes('/images/') ? (
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Bundle Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Paket İçeriği ({bundle.items.length} ürün)</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {selectedCount} seçili
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItems.map((item) => (
                  <div
                    key={item.productId}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      item.selected
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => handleToggleItem(item.productId)}
                    />
                    <div className="w-16 h-16 relative bg-muted rounded-lg flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.product ? (
                        <>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="font-medium hover:text-primary line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.product.brand}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(item.product.priceMin)} -{' '}
                            {formatCurrency(item.product.priceMax)}
                          </p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">
                          Ürün bulunamadı
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.productId, -1)
                        }
                        disabled={item.customQuantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.customQuantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.productId, 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {item.product && (
                      <FavoriteButton
                        itemId={item.product.id}
                        type="product"
                        variant="ghost"
                        size="sm"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Paket fiyatı ({bundle.items.length} ürün)
                    </span>
                    <span>
                      {formatCurrency(bundle.priceMin)} -{' '}
                      {formatCurrency(bundle.priceMax)}
                    </span>
                  </div>
                  {selectedCount !== bundle.items.length && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Seçili ürünler ({selectedCount} ürün)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(customPrice.min)} -{' '}
                        {formatCurrency(customPrice.max)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Toplam (tahmini)</span>
                  <span>
                    {formatCurrency(customPrice.min)} -{' '}
                    {formatCurrency(customPrice.max)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  * Kesin fiyat tedarikçilerden gelen tekliflere göre
                  belirlenecektir.
                </p>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAddAllToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Tüm Paketi Sepete Ekle
                  </Button>

                  {selectedCount !== bundle.items.length && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleAddSelectedToCart}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Seçilenleri Ekle ({selectedCount})
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="text-sm space-y-2">
                  <p className="font-medium">Pakete dahil:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    {bundle.items.map((item) => (
                      <li key={item.productId} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        {item.product?.name || 'Ürün'} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/bundles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Diğer Paketlere Göz At
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
