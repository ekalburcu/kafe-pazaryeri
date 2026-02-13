import Link from 'next/link'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="İgballo Kafe Market"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Kafeniz için ihtiyacınız olan her şey, tek platformda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Hızlı Linkler</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-foreground">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-foreground">
                  Tedarikçiler
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">Kategoriler</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/catalog?category=coffee"
                  className="hover:text-foreground"
                >
                  Kahve & İçecek
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=equipment"
                  className="hover:text-foreground"
                >
                  Ekipman
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=packaging"
                  className="hover:text-foreground"
                >
                  Ambalaj
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=cleaning"
                  className="hover:text-foreground"
                >
                  Temizlik
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">İletişim</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>destek@kafemarket.com</li>
              <li>0850 123 45 67</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} KafeMarket. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
