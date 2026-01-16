import { Product, FilterParams, PaginatedResult } from '@/types'
import { getCategoryById } from './categories'
import { getVendorById } from './vendors'

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Arabica Kahve Çekirdeği',
    slug: 'premium-arabica-kahve-cekirdegi',
    categoryId: 'coffee',
    brand: 'Kahve Dünyası',
    priceMin: 420,
    priceMax: 480,
    vendorId: 'kahve-dunyasi',
    tags: ['arabica', 'premium', 'çekirdek'],
    images: ['/images/products/coffee-1.jpg'],
    moq: 5,
    leadTimeDays: 2,
    availability: 'in_stock',
    description:
      'Yüksek rakımlı bölgelerden özenle seçilmiş %100 Arabica kahve çekirdekleri. Orta kavrulmuş, dengeli asidite ve çikolata notaları.',
    specs: [
      { key: 'Menşei', value: 'Kolombiya' },
      { key: 'Kavurma', value: 'Orta' },
      { key: 'İşleme', value: 'Yıkanmış' },
      { key: 'Ağırlık', value: '1 kg' },
    ],
    featured: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'La Pavoni Espresso Makinesi Professional',
    slug: 'la-pavoni-espresso-makinesi-professional',
    categoryId: 'equipment',
    brand: 'La Pavoni',
    priceMin: 28000,
    priceMax: 32000,
    vendorId: 'ekipman-pro',
    tags: ['espresso', 'profesyonel', 'italyan'],
    images: ['/images/products/espresso-1.jpg'],
    moq: 1,
    leadTimeDays: 7,
    availability: 'in_stock',
    description:
      'İtalyan tasarımı profesyonel espresso makinesi. Çift kazan sistemi, PID sıcaklık kontrolü, paslanmaz çelik gövde.',
    specs: [
      { key: 'Kazan Kapasitesi', value: '2.5 L' },
      { key: 'Pompa Basıncı', value: '15 bar' },
      { key: 'Güç', value: '2200W' },
      { key: 'Boyutlar', value: '45x35x55 cm' },
    ],
    featured: true,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Kraft Bardak 12oz - 1000 Adet',
    slug: 'kraft-bardak-12oz-1000-adet',
    categoryId: 'packaging',
    brand: 'EkoPack',
    priceMin: 1100,
    priceMax: 1300,
    vendorId: 'ambalaj-market',
    tags: ['bardak', 'kraft', 'takeaway'],
    images: ['/images/products/cup-1.jpg'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Çift cidarlı kraft kağıt bardak. Sıcak içecekler için ideal, el yakmaz. %100 geri dönüştürülebilir.',
    specs: [
      { key: 'Kapasite', value: '12 oz (350ml)' },
      { key: 'Adet', value: '1000' },
      { key: 'Malzeme', value: 'Kraft Kağıt' },
      { key: 'Özellik', value: 'Çift Cidar' },
    ],
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    name: 'Espresso Makinesi Temizleme Tableti',
    slug: 'espresso-makinesi-temizleme-tableti',
    categoryId: 'cleaning',
    brand: 'CafeClean',
    priceMin: 85,
    priceMax: 95,
    vendorId: 'temizlik-pro',
    tags: ['temizlik', 'tablet', 'espresso'],
    images: ['/images/products/clean-1.jpg'],
    moq: 10,
    leadTimeDays: 2,
    availability: 'in_stock',
    description:
      'Profesyonel espresso makineleri için özel formüllü temizleme tableti. Yağ ve kahve kalıntılarını etkili bir şekilde temizler.',
    specs: [
      { key: 'Adet', value: '100 tablet' },
      { key: 'Ağırlık', value: '2g/tablet' },
      { key: 'Kullanım', value: 'Günlük' },
    ],
    createdAt: '2024-01-08',
  },
  {
    id: '5',
    name: 'Barista Süt Sürahisi 600ml',
    slug: 'barista-sut-surahisi-600ml',
    categoryId: 'equipment',
    brand: 'Motta',
    priceMin: 280,
    priceMax: 350,
    vendorId: 'ekipman-pro',
    tags: ['barista', 'latte art', 'sürahi'],
    images: ['/images/products/pitcher-1.jpg'],
    moq: 2,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'İtalyan Motta marka profesyonel barista sürahisi. Latte art için ideal ağız tasarımı, paslanmaz çelik.',
    specs: [
      { key: 'Kapasite', value: '600ml' },
      { key: 'Malzeme', value: '18/10 Paslanmaz Çelik' },
      { key: 'Menşei', value: 'İtalya' },
    ],
    createdAt: '2024-01-14',
  },
  {
    id: '6',
    name: 'Organik Tam Yağlı Süt - 12li Paket',
    slug: 'organik-tam-yagli-sut-12li-paket',
    categoryId: 'dairy',
    brand: 'Sütaş',
    priceMin: 360,
    priceMax: 400,
    vendorId: 'sut-deposu',
    tags: ['süt', 'organik', 'tam yağlı'],
    images: ['/images/products/milk-1.jpg'],
    moq: 1,
    leadTimeDays: 1,
    availability: 'in_stock',
    description:
      'Organik sertifikalı tam yağlı süt. Latte ve cappuccino için mükemmel köpürme özelliği.',
    specs: [
      { key: 'Hacim', value: '1L x 12' },
      { key: 'Yağ Oranı', value: '%3.5' },
      { key: 'Sertifika', value: 'Organik' },
    ],
    createdAt: '2024-01-16',
  },
  {
    id: '7',
    name: 'Ethiopia Yirgacheffe Kahve',
    slug: 'ethiopia-yirgacheffe-kahve',
    categoryId: 'coffee',
    brand: 'Kahve Dünyası',
    priceMin: 580,
    priceMax: 650,
    vendorId: 'kahve-dunyasi',
    tags: ['ethiopia', 'specialty', 'çekirdek'],
    images: ['/images/products/coffee-2.jpg'],
    moq: 3,
    leadTimeDays: 2,
    availability: 'limited',
    description:
      'Etiyopya Yirgacheffe bölgesinden özel lot kahve. Çiçeksi aromalar, bergamot ve limon notaları.',
    specs: [
      { key: 'Menşei', value: 'Etiyopya - Yirgacheffe' },
      { key: 'Kavurma', value: 'Açık-Orta' },
      { key: 'İşleme', value: 'Doğal' },
      { key: 'SCA Puanı', value: '87' },
    ],
    featured: true,
    createdAt: '2024-01-11',
  },
  {
    id: '8',
    name: 'Kahve Değirmeni - Eureka Mignon',
    slug: 'kahve-degirmeni-eureka-mignon',
    categoryId: 'equipment',
    brand: 'Eureka',
    priceMin: 12500,
    priceMax: 14000,
    vendorId: 'ekipman-pro',
    tags: ['değirmen', 'espresso', 'profesyonel'],
    images: ['/images/products/grinder-1.jpg'],
    moq: 1,
    leadTimeDays: 5,
    availability: 'in_stock',
    description:
      'Eureka Mignon Specialita kahve değirmeni. Sessiz çalışma, hassas ayar, espresso için ideal.',
    specs: [
      { key: 'Çapak Tipi', value: '55mm Düz' },
      { key: 'Hazne', value: '300g' },
      { key: 'Ayar', value: 'Kademesiz' },
      { key: 'Güç', value: '310W' },
    ],
    createdAt: '2024-01-09',
  },
  {
    id: '9',
    name: 'Plastik Kapak 12oz - 1000 Adet',
    slug: 'plastik-kapak-12oz-1000-adet',
    categoryId: 'packaging',
    brand: 'EkoPack',
    priceMin: 450,
    priceMax: 520,
    vendorId: 'ambalaj-market',
    tags: ['kapak', 'plastik', 'takeaway'],
    images: ['/images/products/lid-1.jpg'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Dome plastik kapak, içecek deliği ile. 12oz bardaklara uyumlu.',
    specs: [
      { key: 'Uyumluluk', value: '12oz Bardak' },
      { key: 'Adet', value: '1000' },
      { key: 'Tip', value: 'Dome' },
    ],
    createdAt: '2024-01-13',
  },
  {
    id: '10',
    name: 'Kafe Sandalyesi - Modern Ahşap',
    slug: 'kafe-sandalyesi-modern-ahsap',
    categoryId: 'furniture',
    brand: 'MobilyaCraft',
    priceMin: 850,
    priceMax: 1100,
    vendorId: 'mobilya-craft',
    tags: ['sandalye', 'ahşap', 'modern'],
    images: ['/images/products/chair-1.jpg'],
    moq: 4,
    leadTimeDays: 14,
    availability: 'pre_order',
    description:
      'Modern tasarım kafe sandalyesi. Masif meşe ahşap, ergonomik oturum, yüksek dayanıklılık.',
    specs: [
      { key: 'Malzeme', value: 'Masif Meşe' },
      { key: 'Yükseklik', value: '82 cm' },
      { key: 'Oturum', value: '45 cm' },
      { key: 'Taşıma Kapasitesi', value: '150 kg' },
    ],
    createdAt: '2024-01-05',
  },
  {
    id: '11',
    name: 'Brazil Santos Kahve Çekirdeği',
    slug: 'brazil-santos-kahve-cekirdegi',
    categoryId: 'coffee',
    brand: 'Kahve Dünyası',
    priceMin: 320,
    priceMax: 380,
    vendorId: 'kahve-dunyasi',
    tags: ['brazil', 'santos', 'çekirdek'],
    images: ['/images/products/coffee-3.jpg'],
    moq: 5,
    leadTimeDays: 2,
    availability: 'in_stock',
    description:
      'Brezilya Santos bölgesinden klasik kahve. Fındık, kakao notaları, düşük asidite.',
    specs: [
      { key: 'Menşei', value: 'Brezilya - Santos' },
      { key: 'Kavurma', value: 'Orta-Koyu' },
      { key: 'İşleme', value: 'Doğal' },
      { key: 'Ağırlık', value: '1 kg' },
    ],
    createdAt: '2024-01-07',
  },
  {
    id: '12',
    name: 'Su Filtresi - BWT Bestmax',
    slug: 'su-filtresi-bwt-bestmax',
    categoryId: 'equipment',
    brand: 'BWT',
    priceMin: 1800,
    priceMax: 2200,
    vendorId: 'ekipman-pro',
    tags: ['filtre', 'su', 'profesyonel'],
    images: ['/images/products/filter-1.jpg'],
    moq: 1,
    leadTimeDays: 4,
    availability: 'in_stock',
    description:
      'Profesyonel su filtresi sistemi. Kireç önleme, optimum mineral dengesi, espresso makineleri için ideal.',
    specs: [
      { key: 'Kapasite', value: '3800 L' },
      { key: 'Bağlantı', value: '3/8"' },
      { key: 'Boyut', value: 'M' },
    ],
    createdAt: '2024-01-06',
  },
]

// Ürünlere kategori ve vendor bilgilerini ekle
export function getProductWithRelations(product: Product): Product {
  return {
    ...product,
    category: getCategoryById(product.categoryId),
    vendor: getVendorById(product.vendorId),
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  const product = products.find((p) => p.slug === slug)
  if (product) {
    return getProductWithRelations(product)
  }
  return undefined
}

export function getProductById(id: string): Product | undefined {
  const product = products.find((p) => p.id === id)
  if (product) {
    return getProductWithRelations(product)
  }
  return undefined
}

// Filtreleme ve sayfalama
export function getProducts(params: FilterParams): PaginatedResult<Product> {
  const pageSize = 12
  const page = params.page || 1

  let filtered = [...products]

  // Filter out hidden products (isActive = false)
  // Check localStorage for product moderation status
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('kafe-market-product-moderation')
      if (stored) {
        const moderation = JSON.parse(stored) as Record<string, { isActive: boolean }>
        filtered = filtered.filter((p) => {
          const mod = moderation[p.id]
          return mod ? mod.isActive !== false : true
        })
      }
    } catch {
      // Ignore errors
    }
  }

  // Kategori filtresi
  if (params.category) {
    filtered = filtered.filter((p) => p.categoryId === params.category)
  }

  // Marka filtresi
  if (params.brand) {
    filtered = filtered.filter(
      (p) => p.brand.toLowerCase() === params.brand?.toLowerCase()
    )
  }

  // Vendor filtresi
  if (params.vendor) {
    filtered = filtered.filter((p) => p.vendorId === params.vendor)
  }

  // Fiyat filtresi
  if (params.minPrice) {
    filtered = filtered.filter((p) => p.priceMin >= params.minPrice!)
  }
  if (params.maxPrice) {
    filtered = filtered.filter((p) => p.priceMax <= params.maxPrice!)
  }

  // Stok durumu filtresi
  if (params.availability) {
    filtered = filtered.filter((p) => p.availability === params.availability)
  }

  // Arama
  if (params.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.tags.some((t) => t.toLowerCase().includes(search))
    )
  }

  // Sıralama
  switch (params.sort) {
    case 'price_asc':
      filtered.sort((a, b) => a.priceMin - b.priceMin)
      break
    case 'price_desc':
      filtered.sort((a, b) => b.priceMin - a.priceMin)
      break
    case 'newest':
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      break
    case 'popular':
    default:
      // Featured önce, sonra tarih
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const data = filtered
    .slice(start, start + pageSize)
    .map(getProductWithRelations)

  return { data, total, page, pageSize, totalPages }
}

// Benzersiz markalar
export function getBrands(): string[] {
  const brands = new Set(products.map((p) => p.brand))
  return Array.from(brands).sort()
}

// Featured ürünler
export function getFeaturedProducts(): Product[] {
  let filtered = products.filter((p) => p.featured)

  // Filter out hidden products
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('kafe-market-product-moderation')
      if (stored) {
        const moderation = JSON.parse(stored) as Record<string, { isActive: boolean }>
        filtered = filtered.filter((p) => {
          const mod = moderation[p.id]
          return mod ? mod.isActive !== false : true
        })
      }
    } catch {
      // Ignore errors
    }
  }

  return filtered.map(getProductWithRelations).slice(0, 4)
}
