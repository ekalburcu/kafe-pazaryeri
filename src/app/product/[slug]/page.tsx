import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, MapPin, Truck, Clock, Package, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Breadcrumbs } from '@/components/catalog'
import {
  ProductGallery,
  SpecsTable,
  AddToCartButton,
} from '@/components/product'
import { getProductBySlug, products } from '@/lib/data'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Static params for build
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

const availabilityLabels: Record<
  string,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  in_stock: { label: 'Stokta', variant: 'default' },
  limited: { label: 'Sınırlı Stok', variant: 'secondary' },
  pre_order: { label: 'Ön Sipariş', variant: 'outline' },
  out_of_stock: { label: 'Tükendi', variant: 'destructive' },
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const availability = availabilityLabels[product.availability]

  const hasSizeVariants =
    product.specs.filter((s) => /^.+\s+[Ff]iyat$/.test(s.key)).length >= 2

  const breadcrumbItems = [
    { label: 'Katalog', href: '/catalog' },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/catalog?category=${product.categoryId}`,
          },
        ]
      : []),
    { label: product.name },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Left: Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Title & Badges */}
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant={availability.variant}>{availability.label}</Badge>
              {product.featured && <Badge>Öne Çıkan</Badge>}
              {product.category && (
                <Badge variant="outline">{product.category.name}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.brand}</p>
          </div>

          {/* Price — static fallback when no size variants; AddToCartButton shows dynamic price otherwise */}
          {!hasSizeVariants && (
            <div>
              <p className="text-3xl font-bold">
                {product.priceMin === product.priceMax
                  ? `${product.priceMin.toLocaleString('tr-TR')} TL`
                  : `${product.priceMin.toLocaleString('tr-TR')} - ${product.priceMax.toLocaleString('tr-TR')} TL`}
              </p>
              <p className="text-muted-foreground text-sm">KDV dahil</p>
            </div>
          )}

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Package className="text-muted-foreground h-4 w-4" />
              <span>Min. sipariş: {product.moq} adet</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span>Teslimat: {product.leadTimeDays} gün</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="mb-2 font-semibold">Ürün Açıklaması</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Tags */}
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

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Vendor Card */}
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
                      <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {product.vendor.city}
                      </p>
                    )}
                  </div>
                  {product.vendor.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {product.vendor.rating}
                      </span>
                    </div>
                  )}
                </div>

                {product.vendor.minOrder && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>
                      Min. sipariş:{' '}
                      {product.vendor.minOrder.toLocaleString('tr-TR')} TL
                    </span>
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

      {/* Specs Section */}
      {product.specs.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Teknik Özellikler</h2>
          <SpecsTable specs={product.specs} />
        </div>
      )}
    </div>
  )
}
