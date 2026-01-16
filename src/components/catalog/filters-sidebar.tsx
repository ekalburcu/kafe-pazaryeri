'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Category, Vendor } from '@/types'

interface FiltersSidebarProps {
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
}

const availabilityOptions = [
  { id: 'in_stock', label: 'Stokta' },
  { id: 'limited', label: 'Sınırlı Stok' },
  { id: 'pre_order', label: 'Ön Sipariş' },
]

export function FiltersSidebar({
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
}: FiltersSidebarProps) {
  const hasActiveFilters =
    selectedCategory ||
    selectedBrands.length > 0 ||
    selectedVendors.length > 0 ||
    selectedAvailability.length > 0

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand))
    } else {
      onBrandChange([...selectedBrands, brand])
    }
  }

  const toggleVendor = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      onVendorChange(selectedVendors.filter((v) => v !== vendorId))
    } else {
      onVendorChange([...selectedVendors, vendorId])
    }
  }

  const toggleAvailability = (availability: string) => {
    if (selectedAvailability.includes(availability)) {
      onAvailabilityChange(
        selectedAvailability.filter((a) => a !== availability)
      )
    } else {
      onAvailabilityChange([...selectedAvailability, availability])
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtreler</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground h-auto p-0"
          >
            <X className="mr-1 h-4 w-4" />
            Temizle
          </Button>
        )}
      </div>

      <Separator />

      <Accordion
        type="multiple"
        defaultValue={['category', 'brand', 'vendor', 'availability']}
        className="w-full"
      >
        {/* Kategori */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">
            Kategori
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Button
                variant={!selectedCategory ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => onCategoryChange(undefined)}
              >
                Tümü
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? 'secondary' : 'ghost'
                  }
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => onCategoryChange(category.id)}
                >
                  <span>{category.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {category.productCount}
                  </span>
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Marka */}
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-medium">
            Marka
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tedarikçi */}
        <AccordionItem value="vendor">
          <AccordionTrigger className="text-sm font-medium">
            Tedarikçi
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vendor-${vendor.id}`}
                    checked={selectedVendors.includes(vendor.id)}
                    onCheckedChange={() => toggleVendor(vendor.id)}
                  />
                  <label
                    htmlFor={`vendor-${vendor.id}`}
                    className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {vendor.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stok Durumu */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium">
            Stok Durumu
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availabilityOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${option.id}`}
                    checked={selectedAvailability.includes(option.id)}
                    onCheckedChange={() => toggleAvailability(option.id)}
                  />
                  <label
                    htmlFor={`availability-${option.id}`}
                    className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
