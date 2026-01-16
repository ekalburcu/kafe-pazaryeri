'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Coffee, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'
import { UserRole } from '@/types'

const cities = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Gaziantep',
  'Mersin',
  'Kayseri',
]

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    companyName: '',
    phone: '',
    city: '',
    role: 'cafe' as UserRole,
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/account')
    return null
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        companyName: formData.companyName || undefined,
        phone: formData.phone || undefined,
        city: formData.city || undefined,
      })

      if (result.success) {
        toast.success('Kayıt başarılı! Hoş geldiniz.')
        router.push('/account')
      } else {
        setError(result.error || 'Kayıt yapılamadı')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <Coffee className="text-primary h-8 w-8" />
            <span className="text-2xl font-bold">KafeMarket</span>
          </div>
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>
            Hemen üye olun ve toptan alışverişe başlayın
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Hesap Türü
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hesap türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cafe">Kafe / İşletme</SelectItem>
                  <SelectItem value="vendor">Tedarikçi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Ad Soyad
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Adınız Soyadınız"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium">
                {formData.role === 'cafe' ? 'Kafe / İşletme Adı' : 'Şirket Adı'}
              </label>
              <Input
                id="companyName"
                type="text"
                placeholder={formData.role === 'cafe' ? 'Kahve Durağı' : 'Şirket Adı'}
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-posta
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@kafe.com"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefon
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="0532 123 45 67"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                Şehir
              </label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleChange('city', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Şifre
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Şifre Tekrar
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kayıt yapılıyor...
                </>
              ) : (
                'Kayıt Ol'
              )}
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              Kayıt olarak{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Kullanım Koşulları
              </Link>
              &apos;nı ve{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Gizlilik Politikası
              </Link>
              &apos;nı kabul etmiş olursunuz.
            </p>
          </CardContent>
        </form>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-center text-sm">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
