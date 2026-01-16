'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  requestResponseSchema,
  RequestResponseFormData,
} from '@/lib/schemas/product'
import { VendorResponse } from '@/types'

interface RequestResponseBoxProps {
  existingResponse?: VendorResponse
  onSubmit: (data: RequestResponseFormData) => Promise<void>
  isLoading?: boolean
}

export function RequestResponseBox({
  existingResponse,
  onSubmit,
  isLoading = false,
}: RequestResponseBoxProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestResponseFormData>({
    resolver: zodResolver(requestResponseSchema),
    defaultValues: {
      unitPrice: existingResponse?.unitPrice || 0,
      deliveryDays: existingResponse?.deliveryDays || 1,
      message: existingResponse?.message || '',
      validUntil: existingResponse?.validUntil || '',
    },
  })

  const onFormSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  })

  const isDisabled = isLoading || isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {existingResponse ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              Yanıtınız
            </>
          ) : (
            'Teklif Yanıtı Gönder'
          )}
        </CardTitle>
        <CardDescription>
          {existingResponse
            ? 'Yanıtınızı güncelleyebilirsiniz'
            : 'Müşteriye fiyat ve teslim bilgisi gönderin'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Birim Fiyat (₺) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                {...register('unitPrice', { valueAsNumber: true })}
                placeholder="0.00"
                disabled={isDisabled}
              />
              {errors.unitPrice && (
                <p className="text-sm text-destructive">
                  {errors.unitPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDays">Teslim Süresi (Gün) *</Label>
              <Input
                id="deliveryDays"
                type="number"
                {...register('deliveryDays', { valueAsNumber: true })}
                placeholder="1"
                disabled={isDisabled}
              />
              {errors.deliveryDays && (
                <p className="text-sm text-destructive">
                  {errors.deliveryDays.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Teklif Geçerlilik Tarihi</Label>
            <Input
              id="validUntil"
              type="date"
              {...register('validUntil')}
              disabled={isDisabled}
            />
            <p className="text-xs text-muted-foreground">
              Boş bırakılırsa süresiz geçerli olur
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Müşteriye iletmek istediğiniz ek bilgiler..."
              rows={3}
              disabled={isDisabled}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isDisabled} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gönderiliyor...
              </>
            ) : existingResponse ? (
              <>
                <Send className="mr-2 h-4 w-4" />
                Yanıtı Güncelle
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Yanıt Gönder
              </>
            )}
          </Button>
        </form>

        {existingResponse && (
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            Son güncelleme:{' '}
            {new Date(existingResponse.respondedAt).toLocaleString('tr-TR')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
