'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { productSchema, ProductFormData } from '@/lib/schemas/product'
import { categories } from '@/lib/data/categories'
import { Product } from '@/types'

const availabilityOptions = [
  { value: 'in_stock', label: 'Stokta' },
  { value: 'limited', label: 'Sınırlı Stok' },
  { value: 'pre_order', label: 'Ön Sipariş' },
  { value: 'out_of_stock', label: 'Stok Dışı' },
]

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: ProductFormData) => Promise<void>
  isLoading?: boolean
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || [''])
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialData?.specs || [{ key: '', value: '' }]
  )
  const [tags, setTags] = useState<string>(initialData?.tags?.join(', ') || '')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      categoryId: initialData?.categoryId || '',
      brand: initialData?.brand || '',
      priceMin: initialData?.priceMin || 0,
      priceMax: initialData?.priceMax || 0,
      moq: initialData?.moq || 1,
      leadTimeDays: initialData?.leadTimeDays || 1,
      availability: initialData?.availability || 'in_stock',
      description: initialData?.description || '',
      images: initialData?.images || [],
      tags: initialData?.tags || [],
      specs: initialData?.specs || [],
    },
  })

  const selectedCategory = watch('categoryId')
  const selectedAvailability = watch('availability')

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
    setValue(
      'images',
      newImages.filter((img) => img.trim() !== '')
    )
  }

  const addImage = () => {
    setImages([...images, ''])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages.length > 0 ? newImages : [''])
    setValue(
      'images',
      newImages.filter((img) => img.trim() !== '')
    )
  }

  const handleSpecChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = value
    setSpecs(newSpecs)
    setValue(
      'specs',
      newSpecs.filter((s) => s.key.trim() !== '' && s.value.trim() !== '')
    )
  }

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }])
  }

  const removeSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index)
    setSpecs(newSpecs.length > 0 ? newSpecs : [{ key: '', value: '' }])
    setValue(
      'specs',
      newSpecs.filter((s) => s.key.trim() !== '' && s.value.trim() !== '')
    )
  }

  const handleTagsChange = (value: string) => {
    setTags(value)
    setValue(
      'tags',
      value
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '')
    )
  }

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ürün Adı *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ürün adını giriniz"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori *</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setValue('categoryId', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marka *</Label>
              <Input
                id="brand"
                {...register('brand')}
                placeholder="Marka adı"
                disabled={isLoading}
              />
              {errors.brand && (
                <p className="text-sm text-destructive">
                  {errors.brand.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Ürün açıklamasını giriniz"
              rows={4}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiketler</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Virgülle ayırarak giriniz (örn: kahve, arabica, premium)"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Etiketleri virgülle ayırarak giriniz
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Fiyat & Stok</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priceMin">Minimum Fiyat (₺) *</Label>
              <Input
                id="priceMin"
                type="number"
                {...register('priceMin', { valueAsNumber: true })}
                placeholder="0"
                disabled={isLoading}
              />
              {errors.priceMin && (
                <p className="text-sm text-destructive">
                  {errors.priceMin.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceMax">Maksimum Fiyat (₺) *</Label>
              <Input
                id="priceMax"
                type="number"
                {...register('priceMax', { valueAsNumber: true })}
                placeholder="0"
                disabled={isLoading}
              />
              {errors.priceMax && (
                <p className="text-sm text-destructive">
                  {errors.priceMax.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="moq">Min. Sipariş Miktarı *</Label>
              <Input
                id="moq"
                type="number"
                {...register('moq', { valueAsNumber: true })}
                placeholder="1"
                disabled={isLoading}
              />
              {errors.moq && (
                <p className="text-sm text-destructive">{errors.moq.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadTimeDays">Teslim Süresi (Gün) *</Label>
              <Input
                id="leadTimeDays"
                type="number"
                {...register('leadTimeDays', { valueAsNumber: true })}
                placeholder="1"
                disabled={isLoading}
              />
              {errors.leadTimeDays && (
                <p className="text-sm text-destructive">
                  {errors.leadTimeDays.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Stok Durumu *</Label>
              <Select
                value={selectedAvailability}
                onValueChange={(value) =>
                  setValue(
                    'availability',
                    value as
                      | 'in_stock'
                      | 'limited'
                      | 'pre_order'
                      | 'out_of_stock'
                  )
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Stok durumu seçin" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.availability && (
                <p className="text-sm text-destructive">
                  {errors.availability.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Görseller</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="Görsel URL'si giriniz"
                disabled={isLoading}
              />
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImage(index)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {errors.images && (
            <p className="text-sm text-destructive">{errors.images.message}</p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={addImage}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Görsel Ekle
          </Button>
          <p className="text-xs text-muted-foreground">
            MVP: Görsel URL&apos;lerini giriniz. Örn:
            https://example.com/image.jpg
          </p>
        </CardContent>
      </Card>

      {/* Specs */}
      <Card>
        <CardHeader>
          <CardTitle>Teknik Özellikler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={spec.key}
                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                placeholder="Özellik adı"
                disabled={isLoading}
              />
              <Input
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, 'value', e.target.value)
                }
                placeholder="Değer"
                disabled={isLoading}
              />
              {specs.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSpec(index)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addSpec}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Özellik Ekle
          </Button>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : initialData ? (
            'Güncelle'
          ) : (
            'Ürün Ekle'
          )}
        </Button>
      </div>
    </form>
  )
}
