'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorLayout } from '@/components/vendor/vendor-layout'
import { ProductForm } from '@/components/vendor/product-form'
import { useAuth } from '@/context/auth-context'
import { getVendorProductById, updateProduct } from '@/lib/data/vendor-products'
import { ProductFormData } from '@/lib/schemas/product'
import { Product } from '@/types'
import { toast } from 'sonner'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      if (user?.role !== 'vendor') {
        router.push('/account')
        return
      }

      // Load product
      const foundProduct = getVendorProductById(productId)
      if (foundProduct && foundProduct.vendorId === user?.vendorId) {
        setProduct(foundProduct)
      } else {
        toast.error('Ürün bulunamadı veya erişim yetkiniz yok')
        router.push('/vendor/products')
      }

      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router, productId])

  const handleSubmit = async (data: ProductFormData) => {
    if (!user?.vendorId || !product) {
      toast.error('Ürün güncellenemedi')
      return
    }

    setIsSubmitting(true)

    try {
      const updated = updateProduct(
        product.id,
        {
          name: data.name,
          categoryId: data.categoryId,
          brand: data.brand,
          priceMin: data.priceMin,
          priceMax: data.priceMax,
          moq: data.moq,
          leadTimeDays: data.leadTimeDays,
          availability: data.availability,
          description: data.description,
          images: data.images,
          tags: data.tags,
          specs: data.specs,
        },
        user.vendorId
      )

      if (updated) {
        toast.success('Ürün başarıyla güncellendi')
        router.push('/vendor/products')
      } else {
        toast.error('Ürün güncellenemedi')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      toast.error('Ürün güncellenirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <VendorLayout title="Ürün Düzenle">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </VendorLayout>
    )
  }

  if (!product) {
    return (
      <VendorLayout title="Ürün Düzenle">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Ürün bulunamadı</p>
          <Button className="mt-4" asChild>
            <Link href="/vendor/products">Ürünlere Dön</Link>
          </Button>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout
      title="Ürün Düzenle"
      description={product.name}
      action={
        <Button variant="outline" asChild>
          <Link href="/vendor/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
        </Button>
      }
    >
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </VendorLayout>
  )
}
