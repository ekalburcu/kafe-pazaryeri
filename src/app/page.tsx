import Link from 'next/link'
import { Coffee, Package, Truck, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categories = [
  { name: 'Kahve & İçecek', count: 150, href: '/catalog?category=coffee' },
  { name: 'Ekipman', count: 85, href: '/catalog?category=equipment' },
  { name: 'Ambalaj', count: 200, href: '/catalog?category=packaging' },
  { name: 'Temizlik', count: 120, href: '/catalog?category=cleaning' },
]

const features = [
  {
    icon: Package,
    title: 'Geniş Ürün Yelpazesi',
    description: 'Kafeniz için ihtiyacınız olan tüm ürünler tek platformda.',
  },
  {
    icon: Truck,
    title: 'Doğrudan Tedarikçiden',
    description: 'Aracı olmadan, doğrudan tedarikçilerle iletişim.',
  },
  {
    icon: Shield,
    title: 'Güvenilir Satıcılar',
    description: 'Doğrulanmış ve güvenilir tedarikçi ağı.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            B2B Marketplace
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Kafeniz İçin <span className="text-primary">Her Şey</span>
            <br />
            Tek Platformda
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Kahve çekirdeklerinden ekipmana, ambalajdan temizlik malzemelerine
            kadar kafenizin tüm ihtiyaçlarını karşılayın.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/catalog">
                Kataloğu İncele
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/vendors">Tedarikçileri Gör</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Popüler Kategoriler
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="hover:border-primary cursor-pointer transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {category.count} ürün
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Neden KafeMarket?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-0 bg-transparent shadow-none"
              >
                <CardHeader>
                  <feature.icon className="text-primary mb-2 h-10 w-10" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Coffee className="text-primary mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-4 text-2xl font-bold">
            Tedarikçi Olmak İster misiniz?
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-xl">
            KafeMarket&apos;te ürünlerinizi binlerce kafeye ulaştırın. Hemen
            başvurun, satışlarınızı artırın.
          </p>
          <Button variant="outline" asChild>
            <Link href="/vendors/apply">Tedarikçi Başvurusu</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
