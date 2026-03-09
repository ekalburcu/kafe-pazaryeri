'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/catalog/product-card'
import { useCatalogOverrides } from '@/hooks/use-catalog-overrides'
import { getFeaturedProducts, getProducts } from '@/lib/data/products'

export function FeaturedProducts() {
  const overrides = useCatalogOverrides()

  const featured = getFeaturedProducts(overrides)
  const products =
    featured.length > 0
      ? featured
      : getProducts({ page: 1 }, overrides).items.slice(0, 8)

  if (products.length === 0) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Öne Çıkan Ürünler</h2>
          <Button variant="ghost" asChild>
            <Link href="/catalog">
              Tümünü Gör
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
