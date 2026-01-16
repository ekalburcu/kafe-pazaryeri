'use client'

import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FiltersSidebar } from './filters-sidebar'
import { Category, Vendor } from '@/types'

interface MobileFiltersProps {
  categories: Category[]
  brands: string[]
  vendors: Vendor[]
  selectedCategory?: string
  selectedBrands: string[]
  selectedVendors: string[]
  selectedAvailability: string[]
  onCategoryChange: (category: string | undefined) => void
  onBrandChange: (brands: string[]) => void
  onVendorChange: (vendors: string[]) => void
  onAvailabilityChange: (availability: string[]) => void
  onClearFilters: () => void
  activeFilterCount: number
}

export function MobileFilters({
  categories,
  brands,
  vendors,
  selectedCategory,
  selectedBrands,
  selectedVendors,
  selectedAvailability,
  onCategoryChange,
  onBrandChange,
  onVendorChange,
  onAvailabilityChange,
  onClearFilters,
  activeFilterCount,
}: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filtreler
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtreler</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FiltersSidebar
            categories={categories}
            brands={brands}
            vendors={vendors}
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            selectedVendors={selectedVendors}
            selectedAvailability={selectedAvailability}
            onCategoryChange={onCategoryChange}
            onBrandChange={onBrandChange}
            onVendorChange={onVendorChange}
            onAvailabilityChange={onAvailabilityChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
