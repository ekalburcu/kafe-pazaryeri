'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ProductGrid } from './product-grid'
import { Pagination } from './pagination'
import { Breadcrumbs } from './breadcrumbs'
import { FiltersSidebar } from './filters-sidebar'
import { SortDropdown } from './sort-dropdown'
import { MobileFilters } from './mobile-filters'
import { categories, vendors, getProducts, getBrands } from '@/lib/data'

type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc'

export function CatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL'den parametreleri oku
  const selectedCategory = searchParams.get('category') || undefined
  const brandParam = searchParams.get('brand')
  const vendorParam = searchParams.get('vendor')
  const availabilityParam = searchParams.get('availability')
  const searchQuery = searchParams.get('search') || ''
  const sortOption = (searchParams.get('sort') as SortOption) || 'popular'
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // Memoize array values to prevent unnecessary re-renders
  const selectedBrands = useMemo(
    () => brandParam?.split(',').filter(Boolean) || [],
    [brandParam]
  )
  const selectedVendors = useMemo(
    () => vendorParam?.split(',').filter(Boolean) || [],
    [vendorParam]
  )
  const selectedAvailability = useMemo(
    () => availabilityParam?.split(',').filter(Boolean) || [],
    [availabilityParam]
  )

  // Marka listesi
  const brands = useMemo(() => getBrands(), [])

  // Ürünleri filtrele
  const result = useMemo(() => {
    return getProducts({
      category: selectedCategory,
      brand: selectedBrands[0],
      vendor: selectedVendors[0],
      availability: selectedAvailability[0],
      search: searchQuery,
      sort: sortOption,
      page: currentPage,
    })
  }, [
    selectedCategory,
    selectedBrands,
    selectedVendors,
    selectedAvailability,
    searchQuery,
    sortOption,
    currentPage,
  ])

  // URL'yi güncelle
  const updateURL = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      if (!('page' in updates)) {
        params.delete('page')
      }

      router.push(`/catalog?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleCategoryChange = (category: string | undefined) => {
    updateURL({ category })
  }

  const handleBrandChange = (brands: string[]) => {
    updateURL({ brand: brands.length > 0 ? brands.join(',') : undefined })
  }

  const handleVendorChange = (vendors: string[]) => {
    updateURL({ vendor: vendors.length > 0 ? vendors.join(',') : undefined })
  }

  const handleAvailabilityChange = (availability: string[]) => {
    updateURL({
      availability:
        availability.length > 0 ? availability.join(',') : undefined,
    })
  }

  const handleSortChange = (sort: SortOption) => {
    updateURL({ sort: sort === 'popular' ? undefined : sort })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateURL({ search: value || undefined })
  }

  const handlePageChange = (page: number) => {
    updateURL({ page: page > 1 ? page.toString() : undefined })
  }

  const handleClearFilters = () => {
    router.push('/catalog', { scroll: false })
  }

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedBrands.length +
    selectedVendors.length +
    selectedAvailability.length

  const breadcrumbItems = [
    { label: 'Katalog', href: '/catalog' },
    ...(selectedCategory
      ? [
          {
            label:
              categories.find((c) => c.id === selectedCategory)?.name ||
              selectedCategory,
          },
        ]
      : []),
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-4 mb-8">
        <h1 className="mb-2 text-3xl font-bold">Ürün Kataloğu</h1>
        <p className="text-muted-foreground">{result.total} ürün bulundu</p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <FiltersSidebar
            categories={categories}
            brands={brands}
            vendors={vendors}
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            selectedVendors={selectedVendors}
            selectedAvailability={selectedAvailability}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onVendorChange={handleVendorChange}
            onAvailabilityChange={handleAvailabilityChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MobileFilters
                categories={categories}
                brands={brands}
                vendors={vendors}
                selectedCategory={selectedCategory}
                selectedBrands={selectedBrands}
                selectedVendors={selectedVendors}
                selectedAvailability={selectedAvailability}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
                onVendorChange={handleVendorChange}
                onAvailabilityChange={handleAvailabilityChange}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />

              <div className="relative flex-1 sm:flex-initial">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Ürün ara..."
                  className="w-full pl-9 sm:w-64"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <SortDropdown value={sortOption} onChange={handleSortChange} />
          </div>

          <ProductGrid products={result.data} />

          {result.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={result.page}
                totalPages={result.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
