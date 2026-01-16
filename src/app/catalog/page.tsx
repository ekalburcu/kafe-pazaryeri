import { Suspense } from 'react'
import { CatalogContent, ProductGridSkeleton } from '@/components/catalog'

function CatalogLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-4 mb-8">
        <div className="bg-muted mb-2 h-9 w-48 animate-pulse rounded" />
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
      </div>
      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="space-y-4">
            <div className="bg-muted h-6 w-24 animate-pulse rounded" />
            <div className="bg-muted h-40 animate-pulse rounded" />
          </div>
        </aside>
        <div className="flex-1">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  )
}
