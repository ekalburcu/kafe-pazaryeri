'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Menu,
  Coffee,
  ShoppingCart,
  User,
  LogOut,
  FileText,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'

const navLinks = [
  { href: '/catalog', label: 'Katalog' },
  { href: '/vendors', label: 'Tedarikçiler' },
]

const roleLabels = {
  cafe: 'Kafe',
  vendor: 'Tedarikçi',
  admin: 'Yönetici',
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { getItemCount } = useCart()
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  const itemCount = getItemCount()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Coffee className="text-primary h-6 w-6" />
          <span className="text-xl font-bold">KafeMarket</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </Button>

          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate text-sm">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {roleLabels[user.role]}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Hesabım
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/requests" className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    Taleplerim
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Ayarlar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Kayıt Ol</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Actions & Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetTitle className="flex items-center gap-2">
                <Coffee className="text-primary h-5 w-5" />
                KafeMarket
              </SheetTitle>

              {/* Mobile User Info */}
              {isAuthenticated && user && (
                <div className="mt-6 flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {roleLabels[user.role]}
                    </p>
                  </div>
                </div>
              )}

              <nav className="mt-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground text-lg font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-lg font-medium transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Sepet
                  {itemCount > 0 && (
                    <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-sm">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated && user ? (
                  <>
                    <div className="my-2 border-t" />
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-lg font-medium transition-colors"
                    >
                      <User className="h-5 w-5" />
                      Hesabım
                    </Link>
                    <Link
                      href="/account/requests"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-lg font-medium transition-colors"
                    >
                      <FileText className="h-5 w-5" />
                      Taleplerim
                    </Link>
                    <div className="my-2 border-t" />
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="flex items-center gap-2 text-lg font-medium text-destructive transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <div className="my-4 space-y-2 border-t pt-4">
                    <Button className="w-full" asChild>
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Giriş Yap
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        Kayıt Ol
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
