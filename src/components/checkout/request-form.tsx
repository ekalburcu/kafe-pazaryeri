'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/cart-context'
import { createRequest } from '@/lib/data/requests'
import { GuestInfo, DeliveryInfo, RequestItem } from '@/types'

export function RequestForm() {
  const router = useRouter()
  const { getCartWithProducts, getSubtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    taxNumber: '',
  })

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: '',
    city: '',
    district: '',
    postalCode: '',
    preferredDate: '',
    notes: '',
  })

  const cartItems = getCartWithProducts()
  const subtotal = getSubtotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !guestInfo.companyName ||
      !guestInfo.contactName ||
      !guestInfo.email ||
      !guestInfo.phone
    ) {
      toast.error('Lütfen zorunlu alanları doldurun')
      return
    }

    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.district) {
      toast.error('Lütfen teslimat adresini doldurun')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Sepetiniz boş')
      return
    }

    setIsSubmitting(true)

    try {
      // Create request items from cart
      const requestItems: RequestItem[] = cartItems.map((item) => ({
        productId: item.productId,
        productName: item.product?.name || '',
        productBrand: item.product?.brand || '',
        vendorId: item.product?.vendorId || '',
        vendorName: item.product?.vendor?.name || '',
        quantity: item.quantity,
        priceMin: item.product?.priceMin || 0,
        priceMax: item.product?.priceMax || 0,
        note: item.note,
      }))

      // Create the request
      const request = createRequest({
        guestInfo,
        deliveryInfo,
        items: requestItems,
        status: 'sent',
        totalEstimate: subtotal,
      })

      // Clear cart
      clearCart()

      // Show success toast
      toast.success('Talebiniz başarıyla oluşturuldu!')

      // Redirect to request detail page
      router.push(`/requests/${request.id}`)
    } catch (error) {
      console.error('Failed to create request:', error)
      toast.error('Talep oluşturulurken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Firma Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Firma Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                value={guestInfo.companyName}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, companyName: e.target.value })
                }
                placeholder="Kafe Adı veya Firma Ünvanı"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxNumber">Vergi Numarası (Opsiyonel)</Label>
              <Input
                id="taxNumber"
                value={guestInfo.taxNumber}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, taxNumber: e.target.value })
                }
                placeholder="Vergi numarası"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">
                Yetkili Adı Soyadı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactName"
                value={guestInfo.contactName}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, contactName: e.target.value })
                }
                placeholder="Ad Soyad"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                Telefon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={guestInfo.phone}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, phone: e.target.value })
                }
                placeholder="05XX XXX XX XX"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              E-posta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={guestInfo.email}
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, email: e.target.value })
              }
              placeholder="ornek@kafe.com"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card>
        <CardHeader>
          <CardTitle>Teslimat Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">
              Adres <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              value={deliveryInfo.address}
              onChange={(e) =>
                setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
              }
              placeholder="Açık adres"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">
                İl <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                value={deliveryInfo.city}
                onChange={(e) =>
                  setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
                }
                placeholder="İstanbul"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">
                İlçe <span className="text-destructive">*</span>
              </Label>
              <Input
                id="district"
                value={deliveryInfo.district}
                onChange={(e) =>
                  setDeliveryInfo({ ...deliveryInfo, district: e.target.value })
                }
                placeholder="Kadıköy"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Posta Kodu</Label>
              <Input
                id="postalCode"
                value={deliveryInfo.postalCode}
                onChange={(e) =>
                  setDeliveryInfo({
                    ...deliveryInfo,
                    postalCode: e.target.value,
                  })
                }
                placeholder="34000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate">Tercih Edilen Teslimat Tarihi</Label>
            <Input
              id="preferredDate"
              type="date"
              value={deliveryInfo.preferredDate}
              onChange={(e) =>
                setDeliveryInfo({
                  ...deliveryInfo,
                  preferredDate: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ek Notlar</Label>
            <Textarea
              id="notes"
              value={deliveryInfo.notes}
              onChange={(e) =>
                setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })
              }
              placeholder="Teslimat ile ilgili özel notlarınız..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Talep Gönderiliyor...
          </>
        ) : (
          'Teklif / Sipariş Talebi Gönder'
        )}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Bu işlemde ödeme yapılmayacaktır. Talebiniz ilgili tedarikçilere
        iletilecek ve sizinle iletişime geçeceklerdir.
      </p>
    </form>
  )
}
