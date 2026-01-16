import { z } from 'zod'

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Ürün adı en az 3 karakter olmalıdır')
    .max(100, 'Ürün adı en fazla 100 karakter olabilir'),
  categoryId: z.string().min(1, 'Kategori seçiniz'),
  brand: z.string().min(1, 'Marka giriniz'),
  priceMin: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır'),
  priceMax: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır'),
  moq: z.number().min(1, 'Minimum sipariş miktarı en az 1 olmalıdır'),
  leadTimeDays: z.number().min(1, 'Teslim süresi en az 1 gün olmalıdır'),
  availability: z.enum(['in_stock', 'limited', 'pre_order', 'out_of_stock'], {
    message: 'Stok durumu seçiniz',
  }),
  description: z
    .string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır')
    .max(2000, 'Açıklama en fazla 2000 karakter olabilir'),
  images: z
    .array(z.string().url('Geçerli bir URL giriniz'))
    .min(1, 'En az 1 görsel ekleyiniz'),
  tags: z.array(z.string()),
  specs: z.array(
    z.object({
      key: z.string().min(1, 'Özellik adı gerekli'),
      value: z.string().min(1, 'Özellik değeri gerekli'),
    })
  ),
})

export type ProductFormData = z.infer<typeof productSchema>

// Schema for vendor response to a request
export const requestResponseSchema = z.object({
  unitPrice: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır'),
  deliveryDays: z.number().min(1, 'Teslim süresi en az 1 gün olmalıdır'),
  message: z.string().max(1000, 'Mesaj en fazla 1000 karakter olabilir').optional(),
  validUntil: z.string().optional(),
})

export type RequestResponseFormData = z.infer<typeof requestResponseSchema>
