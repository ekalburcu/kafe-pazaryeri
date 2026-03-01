'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Truck, Clock, Package, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Breadcrumbs } from '@/components/catalog'
import { ProductGallery, SpecsTable, AddToCartButton } from '@/components/product'
import { getProductBySlug, getProductWithRelations } from '@/lib/data'
import { supabase, supabaseEnabled } from '@/lib/supabase'
import { Product } from '@/types'

const availabilityLabels: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  in_stock: { label: 'Stokta', variant: 'default' },
  limited: { label: 'Sınırlı Stok', variant: 'secondary' },
  pre_order: { label: 'Ön Sipariş', variant: 'outline' },
  out_of_stock: { label: 'Tükendi', variant: 'destructive' },
}

export function ProductPageClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined)

  useEffect(() => {
    async function load() {
      // 1. Try mock/localStorage products
      const local = getProductBySlug(slug)
      if (local) {
        setProduct(local)
        return
      }

      // 2. Try Supabase admin_products
      if (supabaseEnabled) {
        try {
          const { data } = await supabase
            .from('admin_products')
            .select('data')
            .eq('data->>slug', slug)
            .single()
          if (data) {
            setProduct(getProductWithRelations(data.data as Product))
            return
          }
        } catch {
          // not found
        }
      }

      setProduct(null)
    }
    load()
  }, [slug])

  // Loading
  if (product === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  // Not found even client-side
  if (product === null) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Ürün Bulunamadı</h1>
        <p className="mt-2 text-muted-foreground">Bu ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Button asChild className="mt-4">
          <Link href="/catalog">Kataloğa Dön</Link>
        </Button>
      </div>
    )
  }

  const availability = availabilityLabels[product.availability] ?? availabilityLabels.in_stock
  const hasSizeVariants =
    product.specs.filter((s) => /^.+\s+[Ff]iyat$/.test(s.key)).length >= 2

  const breadcrumbItems = [
    { label: 'Katalog', href: '/catalog' },
    ...(product.category
      ? [{ label: product.category.name, href: `/catalog?category=${product.categoryId}` }]
      : []),
    { label: product.name },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant={availability.variant}>{availability.label}</Badge>
              {product.featured && <Badge>Öne Çıkan</Badge>}
              {product.category && (
                <Badge variant="outline">{product.category.name}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-muted-foreground">{product.brand}</p>
          </div>

          {!hasSizeVariants && (
            <div>
              <p className="text-3xl font-bold">
                {product.priceMin === product.priceMax
                  ? `${product.priceMin.toLocaleString('tr-TR')} TL`
                  : `${product.priceMin.toLocaleString('tr-TR')} - ${product.priceMax.toLocaleString('tr-TR')} TL`}
              </p>
              <p className="text-sm text-muted-foreground">KDV dahil</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>Min. sipariş: {product.moq} adet</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Teslimat: {product.leadTimeDays} gün</span>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">Ürün Açıklaması</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          <AddToCartButton product={product} />

          {product.vendor && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tedarikçi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{product.vendor.name}</p>
                    {product.vendor.city && (
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {product.vendor.city}
                      </p>
                    )}
                  </div>
                  {product.vendor.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.vendor.rating}</span>
                    </div>
                  )}
                </div>

                {product.vendor.minOrder && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Min. sipariş: {product.vendor.minOrder.toLocaleString('tr-TR')} TL</span>
                  </div>
                )}

                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/vendors/${product.vendor.slug}`}>
                    Tedarikçi Profilini Gör
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {product.specs.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Teknik Özellikler</h2>
          <SpecsTable specs={product.specs} />
        </div>
      )}
    </div>
  )
}
