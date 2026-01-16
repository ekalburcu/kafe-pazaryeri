import Link from 'next/link'
import { Search, MapPin, Star, Package } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const dummyVendors = [
  {
    id: 1,
    name: 'Kahve Dünyası',
    description: 'Premium kahve çekirdekleri ve öğütülmüş kahveler',
    location: 'İstanbul',
    rating: 4.8,
    productCount: 45,
    categories: ['Kahve', 'İçecek'],
    verified: true,
  },
  {
    id: 2,
    name: 'Ekipman Pro',
    description: 'Profesyonel kafe ekipmanları ve servis',
    location: 'Ankara',
    rating: 4.6,
    productCount: 120,
    categories: ['Ekipman', 'Servis'],
    verified: true,
  },
  {
    id: 3,
    name: 'Ambalaj Market',
    description: 'Her türlü kafe ambalaj malzemesi',
    location: 'İzmir',
    rating: 4.5,
    productCount: 200,
    categories: ['Ambalaj', 'Bardak'],
    verified: true,
  },
  {
    id: 4,
    name: 'Temizlik Pro',
    description: 'Profesyonel temizlik malzemeleri',
    location: 'Bursa',
    rating: 4.3,
    productCount: 80,
    categories: ['Temizlik'],
    verified: false,
  },
  {
    id: 5,
    name: 'Süt Deposu',
    description: 'Taze süt ve süt ürünleri tedarikçisi',
    location: 'İstanbul',
    rating: 4.7,
    productCount: 25,
    categories: ['Süt', 'İçecek'],
    verified: true,
  },
  {
    id: 6,
    name: 'Şeker & Tatlandırıcı',
    description: 'Şeker, bal ve alternatif tatlandırıcılar',
    location: 'Konya',
    rating: 4.4,
    productCount: 35,
    categories: ['Gıda'],
    verified: false,
  },
]

export default function VendorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tedarikçiler</h1>
        <p className="text-muted-foreground">
          Güvenilir tedarikçilerle doğrudan iletişime geçin
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Tedarikçi ara..." className="pl-9" />
        </div>
        <Button variant="outline" asChild>
          <Link href="/vendors/apply">Tedarikçi Ol</Link>
        </Button>
      </div>

      {/* Vendors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dummyVendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {vendor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {vendor.name}
                      {vendor.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Doğrulanmış
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {vendor.location}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {vendor.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {vendor.categories.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {vendor.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {vendor.productCount} ürün
                </span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/vendors/${vendor.id}`}>Profili Gör</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
