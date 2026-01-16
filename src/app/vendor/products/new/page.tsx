'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorLayout } from '@/components/vendor/vendor-layout'
import { ProductForm } from '@/components/vendor/product-form'
import { useAuth } from '@/context/auth-context'
import { createProduct } from '@/lib/data/vendor-products'
import { ProductFormData } from '@/lib/schemas/product'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
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
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleSubmit = async (data: ProductFormData) => {
    if (!user?.vendorId) {
      toast.error('Vendor ID bulunamadı')
      return
    }

    setIsSubmitting(true)

    try {
      createProduct(
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
          vendorId: user.vendorId,
        },
        user.vendorId
      )

      toast.success('Ürün başarıyla eklendi')
      router.push('/vendor/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Ürün eklenirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <VendorLayout title="Yeni Ürün">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </VendorLayout>
    )
  }

  return (
    <VendorLayout
      title="Yeni Ürün Ekle"
      description="Ürün bilgilerini girerek yeni bir ürün ekleyin"
      action={
        <Button variant="outline" asChild>
          <Link href="/vendor/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
        </Button>
      }
    >
      <ProductForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </VendorLayout>
  )
}
