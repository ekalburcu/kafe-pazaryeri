'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/vendor/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/vendor/products',
    label: 'Ürünlerim',
    icon: Package,
  },
  {
    href: '/vendor/requests',
    label: 'Gelen Talepler',
    icon: FileText,
  },
  {
    href: '/vendor/settings',
    label: 'Ayarlar',
    icon: Settings,
  },
]

interface VendorLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function VendorLayout({
  children,
  title,
  description,
  action,
}: VendorLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Ana Sayfa
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Tedarikçi Paneli</span>
        {title !== 'Dashboard' && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{title}</span>
          </>
        )}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              {/* User Info */}
              <div className="mb-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {user?.companyName?.[0] || user?.name?.[0] || 'V'}
                </div>
                <p className="font-medium truncate">
                  {user?.companyName || user?.name}
                </p>
                <p className="text-xs text-muted-foreground">Tedarikçi</p>
              </div>
              <Separator className="mb-4" />

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
                <Separator className="my-2" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap
                </button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Button
                key={item.href}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </div>

        {/* Main Content */}
        <main>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {action}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
