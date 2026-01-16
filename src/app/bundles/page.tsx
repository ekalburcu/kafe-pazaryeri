'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ShoppingCart, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useCart } from '@/context/cart-context'
import {
  getAllBundles,
  getFeaturedBundles,
  getBundleCategories,
  getBundlesByCategory,
} from '@/lib/data/bundles'
import { Bundle } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function BundlesPage() {
  const { addBundleToCart } = useCart()
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [featuredBundles, setFeaturedBundles] = useState<Bundle[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const categories = getBundleCategories()

  useEffect(() => {
    setFeaturedBundles(getFeaturedBundles())
    if (selectedCategory) {
      setBundles(
        getBundlesByCategory(selectedCategory as Bundle['category'])
      )
    } else {
      setBundles(getAllBundles())
    }
    setIsLoading(false)
  }, [selectedCategory])

  const handleAddToCart = (bundle: Bundle, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addBundleToCart(bundle)
    toast.success(`${bundle.name} sepete eklendi (${bundle.items.length} ürün)`)
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Kafe Paketleri</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Yeni kafenizi açıyorsunuz veya stoklarınızı yenilemek mi
            istiyorsunuz? Hazır paketlerimizle zamandan tasarruf edin.
          </p>
        </div>

        {/* Featured Bundles */}
        {featuredBundles.length > 0 && !selectedCategory && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Popüler Paketler
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredBundles.map((bundle) => (
                <Card
                  key={bundle.id}
                  className="group relative overflow-hidden border-2 border-primary/20"
                >
                  <Badge className="absolute top-4 left-4 z-10">Popüler</Badge>
                  <Link href={`/bundles/${bundle.slug}`}>
                    <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-primary/5">
                      {bundle.image && !bundle.image.includes('/images/') ? (
                        <Image
                          src={bundle.image}
                          alt={bundle.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-16 w-16 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {bundle.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {bundle.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-lg">
                          {formatCurrency(bundle.priceMin)} -{' '}
                          {formatCurrency(bundle.priceMax)}
                        </p>
                        <Badge variant="outline">
                          {bundle.items.length} ürün
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                  <CardFooter className="pt-0">
                    <Button
                      className="w-full"
                      onClick={(e) => handleAddToCart(bundle, e)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Hepsini Sepete Ekle
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
            >
              Tümü
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </section>

        {/* All Bundles */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            {selectedCategory
              ? categories.find((c) => c.value === selectedCategory)?.label
              : 'Tüm Paketler'}
          </h2>
          {bundles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Bu kategoride paket yok</h3>
                <p className="text-muted-foreground text-sm">
                  Farklı bir kategori deneyin
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {bundles.map((bundle) => (
                <Card key={bundle.id} className="group">
                  <Link href={`/bundles/${bundle.slug}`}>
                    <div className="aspect-video relative bg-gradient-to-br from-muted to-muted/50">
                      {bundle.image && !bundle.image.includes('/images/') ? (
                        <Image
                          src={bundle.image}
                          alt={bundle.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {bundle.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {bundle.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">
                          {formatCurrency(bundle.priceMin)} -{' '}
                          {formatCurrency(bundle.priceMax)}
                        </p>
                        <Badge variant="secondary">
                          {bundle.items.length} ürün
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                  <CardFooter className="pt-0 gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/bundles/${bundle.slug}`}>
                        Detaylar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      onClick={(e) => handleAddToCart(bundle, e)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            İhtiyacınıza Uygun Paket Bulamadınız mı?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Katalogumuzdan kendi seçimlerinizle özel bir liste oluşturun ve
            teklif isteyin.
          </p>
          <Button size="lg" asChild>
            <Link href="/catalog">
              Kataloğa Git
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
