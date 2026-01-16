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
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/account')
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success('Giriş başarılı!')
        router.push('/account')
      } else {
        setError(result.error || 'Giriş yapılamadı')
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
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>
            Hesabınıza giriş yaparak alışverişe başlayın
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
              <label htmlFor="email" className="text-sm font-medium">
                E-posta
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@kafe.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Şifre
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-primary text-sm hover:underline"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>

            <div className="relative">
              <Separator />
              <span className="bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
                veya
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" type="button" disabled>
                Google
              </Button>
              <Button variant="outline" type="button" disabled>
                Apple
              </Button>
            </div>

            <div className="bg-muted rounded-md p-3 text-xs">
              <p className="font-medium mb-1">Test hesapları:</p>
              <p>Kafe: kafe@example.com / kafe123</p>
              <p>Vendor: vendor@example.com / vendor123</p>
              <p>Admin: admin@example.com / admin123</p>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex-col gap-4">
          <p className="text-muted-foreground text-center text-sm">
            Hesabınız yok mu?{' '}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Kayıt Ol
            </Link>
          </p>
          <p className="text-muted-foreground text-center text-xs">
            Tedarikçi misiniz?{' '}
            <Link
              href="/auth/vendor-login"
              className="text-primary hover:underline"
            >
              Tedarikçi Girişi
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
