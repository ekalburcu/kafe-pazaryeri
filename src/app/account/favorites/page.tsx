'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  Package,
  Building2,
  Star,
  MapPin,
  ArrowRight,
  History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'
import {
  getFavoriteProducts,
  getFavoriteVendors,
  getFrequentlyOrderedProducts,
  getFavoritesStats,
} from '@/lib/data/favorites'
import { Product, Vendor } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [favoriteVendors, setFavoriteVendors] = useState<Vendor[]>([])
  const [frequentlyOrdered, setFrequentlyOrdered] = useState<Product[]>([])
  const [stats, setStats] = useState({ productCount: 0, vendorCount: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const loadData = () => {
    if (user) {
      setFavoriteProducts(getFavoriteProducts(user.id))
      setFavoriteVendors(getFavoriteVendors(user.id))
      setFrequentlyOrdered(getFrequentlyOrderedProducts(user.id))
      setStats(getFavoritesStats(user.id))
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }
      loadData()
      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleAddToCart = (product: Product) => {
    addItem(product.id, product.moq)
    toast.success(`${product.name} sepete eklendi`)
  }

  if (authLoading || isLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            Favorilerim
          </h1>
          <p className="text-muted-foreground mt-1">
            {stats.productCount} ürün, {stats.vendorCount} tedarikçi
          </p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Ürünler ({stats.productCount})
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Tedarikçiler ({stats.vendorCount})
            </TabsTrigger>
            <TabsTrigger value="frequent" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Sık Alınanlar
            </TabsTrigger>
          </TabsList>

          {/* Favori Ürünler */}
          <TabsContent value="products">
            {favoriteProducts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    Henüz favori ürününüz yok
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Katalogda gezinin ve beğendiğiniz ürünleri favorilere
                    ekleyin
                  </p>
                  <Button asChild>
                    <Link href="/catalog">
                      Kataloğa Git
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteProducts.map((product) => (
                  <Card key={product.id} className="group relative">
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton
                        itemId={product.id}
                        type="product"
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <Link href={`/product/${product.slug}`}>
                      <div className="aspect-square relative bg-muted">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          {product.brand}
                        </p>
                        <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm font-semibold mt-2">
                          {formatCurrency(product.priceMin)} -{' '}
                          {formatCurrency(product.priceMax)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Min. {product.moq} adet
                        </p>
                      </CardContent>
                    </Link>
                    <div className="px-4 pb-4">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddToCart(product)}
                      >
                        Sepete Ekle
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favori Tedarikçiler */}
          <TabsContent value="vendors">
            {favoriteVendors.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    Henüz favori tedarikçiniz yok
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Tedarikçileri keşfedin ve beğendiklerinizi favorilere
                    ekleyin
                  </p>
                  <Button asChild>
                    <Link href="/vendors">
                      Tedarikçilere Git
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteVendors.map((vendor) => (
                  <Card key={vendor.id} className="group relative">
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton
                        itemId={vendor.id}
                        type="vendor"
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <Link href={`/vendors`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {vendor.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {vendor.city && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {vendor.city}
                            </div>
                          )}
                          {vendor.rating && (
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              {vendor.rating}/5
                            </div>
                          )}
                          {vendor.verified && (
                            <Badge variant="secondary">Doğrulanmış</Badge>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {vendor.productCount || 0} ürün
                          </p>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sık Alınanlar */}
          <TabsContent value="frequent">
            {frequentlyOrdered.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    Henüz sipariş geçmişiniz yok
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Sipariş verdikçe sık aldığınız ürünler burada görünecek
                  </p>
                  <Button asChild>
                    <Link href="/catalog">
                      Alışverişe Başla
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sık Aldığınız Ürünler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Geçmiş siparişlerinize göre en çok aldığınız ürünler
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {frequentlyOrdered.map((product) => (
                        <Card key={product.id} className="group">
                          <Link href={`/product/${product.slug}`}>
                            <div className="aspect-square relative bg-muted">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded-t-lg"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <p className="text-xs text-muted-foreground mb-1">
                                {product.brand}
                              </p>
                              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm font-semibold mt-2">
                                {formatCurrency(product.priceMin)} -{' '}
                                {formatCurrency(product.priceMax)}
                              </p>
                            </CardContent>
                          </Link>
                          <div className="px-4 pb-4">
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleAddToCart(product)}
                            >
                              Tekrar Sepete Ekle
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
