'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Heart,
  Package,
  ShoppingCart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/auth-context'

const roleLabels = {
  cafe: 'Kafe / İşletme',
  vendor: 'Tedarikçi',
  admin: 'Yönetici',
}

const roleColors = {
  cafe: 'default' as const,
  vendor: 'secondary' as const,
  admin: 'destructive' as const,
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Hesabım</h1>
        <p className="text-muted-foreground mt-1">
          Profil bilgilerinizi görüntüleyin ve yönetin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar Navigation */}
        <Card className="h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 rounded-md bg-muted px-3 py-2 text-sm font-medium"
              >
                <User className="h-4 w-4" />
                Profil
              </Link>
              <Link
                href="/account/requests"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <FileText className="h-4 w-4" />
                Taleplerim
              </Link>
              <Link
                href="/account/favorites"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                Favorilerim
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Ayarlar
              </Link>
              <Separator className="my-2" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {user.name}
                    <Badge variant={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Kişisel bilgileriniz</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/account/settings">Düzenle</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.companyName && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {user.role === 'cafe' ? 'İşletme' : 'Şirket'}
                      </p>
                      <p className="font-medium">{user.companyName}</p>
                    </div>
                  </div>
                )}

                {user.city && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Şehir</p>
                      <p className="font-medium">{user.city}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Üyelik Tarihi</p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan işlemleriniz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/catalog">
                    <Package className="mr-2 h-4 w-4" />
                    Ürünlere Göz At
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/account/requests">
                    <FileText className="mr-2 h-4 w-4" />
                    Taleplerim
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/account/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorilerim
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/bundles">
                    <Package className="mr-2 h-4 w-4" />
                    Kafe Paketleri
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Sepetim
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/vendors">
                    <Building2 className="mr-2 h-4 w-4" />
                    Tedarikçiler
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
