import { Product } from '@/types'
import { ProductCard } from './product-card'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">
          Aramanızla eşleşen ürün bulunamadı.
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Filtreleri değiştirmeyi veya farklı anahtar kelimeler aramayı deneyin.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
