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
  // ─── TOP ROASTERS – ESPRESSOLAR ───────────────────────────────
  {
    id: 'tr-esp-bar-top',
    name: 'Espresso Bar Top',
    slug: 'espresso-bar-top-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 213.59,
    priceMax: 817.96,
    vendorId: 'top-roasters',
    tags: ['espresso', 'top-roasters', 'latte-art', 'premium'],
    images: ['https://static.wixstatic.com/media/36a067_65aec9028ecb461f8ae0fccab4e07105~mv2.png/v1/fit/w_547,h_547,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Latte art için ideal kalın krem yapan premium espresso çekirdeği. Top Roasters özel karışımı.',
    specs: [
      { key: 'Alt Başlık', value: 'Thick Cream for Latte Art' },
      { key: '250g Fiyat', value: '213,59 ₺' },
      { key: '500g Fiyat', value: '418,08 ₺' },
      { key: '1kg Fiyat', value: '817,96 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    featured: true,
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-esp-garcia',
    name: 'Espresso Special Edition by Garcia',
    slug: 'espresso-special-edition-garcia-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 231.47,
    priceMax: 889.46,
    vendorId: 'top-roasters',
    tags: ['espresso', 'top-roasters', 'special-edition', 'garcia'],
    images: ['https://static.wixstatic.com/media/36a067_ecf835c69e1844b9a59c3e4fbb8669c4~mv2.png/v1/fit/w_547,h_547,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Garcia tarafından özel olarak hazırlanmış limited edition espresso blend. Komplex aroma profili ile.',
    specs: [
      { key: '250g Fiyat', value: '231,47 ₺' },
      { key: '500g Fiyat', value: '453,83 ₺' },
      { key: '1kg Fiyat', value: '889,46 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    featured: true,
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-esp-barista-blend',
    name: 'Espresso Barista Blend',
    slug: 'espresso-barista-blend-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 746.46,
    priceMax: 746.46,
    vendorId: 'top-roasters',
    tags: ['espresso', 'top-roasters', 'barista'],
    images: ['https://static.wixstatic.com/media/02d13f_b497dc6a29644d3289f5989397cb8755~mv2.png/v1/fit/w_3375,h_3375,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Profesyonel baristalar için tasarlanmış dengeli espresso blend. Sadece 1 kg paket olarak mevcuttur.',
    specs: [
      { key: '1kg Fiyat', value: '746,46 ₺' },
      { key: 'Mevcut Boyut', value: '1 kg' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  // ─── TOP ROASTERS – FİLTRE KAHVELER ──────────────────────────
  {
    id: 'tr-filtre-classico',
    name: 'Filtre Classico',
    slug: 'filtre-classico-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 209.3,
    priceMax: 800.8,
    vendorId: 'top-roasters',
    tags: ['filtre', 'top-roasters', 'classico'],
    images: ['https://static.wixstatic.com/media/36a067_95bb4d3e9b164247837e9a4d608c0e49~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Klasik filtre kahve deneyimi için ideal çekirdek. Dengeli asidite ve yumuşak ağız hissi ile.',
    specs: [
      { key: '250g Fiyat', value: '209,30 ₺' },
      { key: '500g Fiyat', value: '409,50 ₺' },
      { key: '1kg Fiyat', value: '800,80 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-filtre-premio',
    name: 'Filtre Premio',
    slug: 'filtre-premio-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 228.61,
    priceMax: 878.02,
    vendorId: 'top-roasters',
    tags: ['filtre', 'top-roasters', 'premio', 'premium'],
    images: ['https://static.wixstatic.com/media/36a067_63c37517b15349c7816c931872887924~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Premium kaliteli filtre kahve çekirdeği. Özel lot kahvelerden özenle seçilmiş.',
    specs: [
      { key: '250g Fiyat', value: '228,61 ₺' },
      { key: '500g Fiyat', value: '448,11 ₺' },
      { key: '1kg Fiyat', value: '878,02 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-filtre-barista-blend',
    name: 'Filtre Kahve Barista Blend',
    slug: 'filtre-kahve-barista-blend-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 746.46,
    priceMax: 746.46,
    vendorId: 'top-roasters',
    tags: ['filtre', 'top-roasters', 'barista'],
    images: ['https://static.wixstatic.com/media/02d13f_30156d863981498fa5da58b09b856ed1~mv2.png/v1/fit/w_3375,h_3375,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Barista kullanımına özel filtre kahve blend. Sadece 1 kg paket olarak mevcuttur.',
    specs: [
      { key: '1kg Fiyat', value: '746,46 ₺' },
      { key: 'Mevcut Boyut', value: '1 kg' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  // ─── TOP ROASTERS – TÜRK KAHVELERİ ───────────────────────────
  {
    id: 'tr-sultanahmet-kahve',
    name: 'Tarihi Sultanahmet Türk Kahvesi',
    slug: 'tarihi-sultanahmet-turk-kahvesi-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 70.07,
    priceMax: 70.07,
    vendorId: 'top-roasters',
    tags: ['türk-kahve', 'top-roasters', 'sultanahmet'],
    images: ['https://static.wixstatic.com/media/02d13f_0e70f17685994839b5d18dc15051bae9~mv2.png/v1/fit/w_3375,h_3375,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Tarihi Sultanahmet bölgesinden özel Türk kahvesi. 100g starter paket olarak sunulur.',
    specs: [
      { key: 'Boyut', value: '100 g' },
      { key: '100g Fiyat', value: '70,07 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-orta-kavrulmus',
    name: 'Orta Kavrulmuş Türk Kahvesi',
    slug: 'orta-kavrulmus-turk-kahvesi-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 183.56,
    priceMax: 697.84,
    vendorId: 'top-roasters',
    tags: ['türk-kahve', 'top-roasters', 'orta-kavrum'],
    images: ['https://static.wixstatic.com/media/02d13f_281981e3a6eb42b0b8b17275fbf281c3~mv2.png/v1/fit/w_3375,h_3375,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Geleneksel yöntemle orta kavrulmuş Türk kahvesi. Zengin aroma ve dengeli tat profili.',
    specs: [
      { key: '250g Fiyat', value: '183,56 ₺' },
      { key: '500g Fiyat', value: '358,02 ₺' },
      { key: '1kg Fiyat', value: '697,84 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-menengic',
    name: 'Menengiç Kahvesi',
    slug: 'menengic-kahvesi-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 93.8,
    priceMax: 336.0,
    vendorId: 'top-roasters',
    tags: ['türk-kahve', 'top-roasters', 'menengiç', 'alternatif'],
    images: ['https://static.wixstatic.com/media/02d13f_597d119b0f494346a12669f46020c03f~mv2.png/v1/fit/w_3375,h_3375,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Doğal menengiç meyvesinden yapılan geleneksel kahve alternatifi. Kafeinsiz, sağlıklı tercih.',
    specs: [
      { key: '250g Fiyat', value: '93,80 ₺' },
      { key: '500g Fiyat', value: '177,80 ₺' },
      { key: '1kg Fiyat', value: '336,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-dibek',
    name: 'Dibek Kahvesi',
    slug: 'dibek-kahvesi-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 93.8,
    priceMax: 336.0,
    vendorId: 'top-roasters',
    tags: ['türk-kahve', 'top-roasters', 'dibek', 'geleneksel'],
    images: ['https://static.wixstatic.com/media/36a067_085a2f3cad2044218e56a4543695062f~mv2.jpg/v1/fit/w_1024,h_1024,q_90/file.jpg'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Taş dibekte öğütülen geleneksel Anadolu kahvesi. Kadim tarifi ile hazırlanır.',
    specs: [
      { key: '250g Fiyat', value: '93,80 ₺' },
      { key: '500g Fiyat', value: '177,80 ₺' },
      { key: '1kg Fiyat', value: '336,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-aromali-turk',
    name: 'Aromalı Türk Kahvesi',
    slug: 'aromali-turk-kahvesi-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 195.0,
    priceMax: 743.6,
    vendorId: 'top-roasters',
    tags: ['türk-kahve', 'top-roasters', 'aromalı', 'damla-sakızı', 'vanilya'],
    images: ['https://static.wixstatic.com/media/02d13f_281981e3a6eb42b0b8b17275fbf281c3~mv2.png/v1/fit/w_3375,h_3375,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      '4 farklı aroma seçeneğli Türk kahvesi: Damla Sakızı, Dağ Çileği, Vanilya ve Çikolata.',
    specs: [
      { key: 'Aroma Çeşitleri', value: 'Damla Sakızı, Dağ Çileği, Vanilya, Çikolata' },
      { key: '250g Fiyat', value: '195,00 ₺' },
      { key: '500g Fiyat', value: '380,90 ₺' },
      { key: '1kg Fiyat', value: '743,60 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  // ─── TOP ROASTERS – LİKİT KAHVELER ───────────────────────────
  {
    id: 'tr-cold-brew-1lt',
    name: 'Cold Brew 1 Lt',
    slug: 'cold-brew-1lt-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 214.5,
    priceMax: 214.5,
    vendorId: 'top-roasters',
    tags: ['likit', 'top-roasters', 'cold-brew', 'hazır'],
    images: ['https://static.wixstatic.com/media/36a067_93595e2b4b2c40e49076dd9293d4cb11~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 2,
    availability: 'in_stock',
    description:
      '24 saatte yavaş demlenen soğuk brew kahve. 1 litre hazır servis formatında.',
    specs: [
      { key: 'Hacim', value: '1 Litre' },
      { key: 'Ambalaj', value: 'PET Şişe' },
      { key: 'Fiyat', value: '214,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-cold-brew-200ml',
    name: 'Cold Brew 200 ml',
    slug: 'cold-brew-200ml-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 71.5,
    priceMax: 71.5,
    vendorId: 'top-roasters',
    tags: ['likit', 'top-roasters', 'cold-brew', 'bireysel'],
    images: ['https://static.wixstatic.com/media/36a067_93595e2b4b2c40e49076dd9293d4cb11~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 2,
    availability: 'in_stock',
    description:
      'Bireysel porsiyon soğuk brew kahve. Hızlı servis için ideal 200ml PET ambalajda.',
    specs: [
      { key: 'Hacim', value: '200 ml' },
      { key: 'Ambalaj', value: 'PET' },
      { key: 'Fiyat', value: '71,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  // ─── TOP ROASTERS – YÖRESEL KAHVELER ─────────────────────────
  {
    id: 'tr-indonesia-sumatra',
    name: 'Indonesia Sumatra Grade 1',
    slug: 'indonesia-sumatra-grade-1-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 473.85,
    priceMax: 1859.0,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'indonesia', 'sumatra', 'single-origin'],
    images: ['https://static.wixstatic.com/media/36a067_6a1e7570e8ff417182ceb90a91c69fa6~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Endonezya Sumatra adasından Grade 1 kalitede özel lot kahve çekirdeği. Toprak ve çikolata notaları.',
    specs: [
      { key: 'Menşei', value: 'Indonesia – Sumatra' },
      { key: 'Grade', value: '1' },
      { key: '250g Fiyat', value: '473,85 ₺' },
      { key: '500g Fiyat', value: '938,60 ₺' },
      { key: '1kg Fiyat', value: '1.859,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    featured: true,
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-kenia-aa',
    name: 'Kenia AA',
    slug: 'kenia-aa-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 312.98,
    priceMax: 1215.5,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'kenya', 'single-origin', 'african'],
    images: ['https://static.wixstatic.com/media/36a067_925d4e24fa344538bb531e6acd95d3ad~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Kenya AA kalitede premium kahve çekirdeği. Kırmızı meyve, sitrik asidite ve tatlı bitiş ile tanınan.',
    specs: [
      { key: 'Menşei', value: 'Kenya' },
      { key: 'Grade', value: 'AA' },
      { key: '250g Fiyat', value: '312,98 ₺' },
      { key: '500g Fiyat', value: '616,85 ₺' },
      { key: '1kg Fiyat', value: '1.215,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-costa-rica',
    name: 'Costa Rica',
    slug: 'costa-rica-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 330.85,
    priceMax: 1287.0,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'costa-rica', 'single-origin', 'central-america'],
    images: ['https://static.wixstatic.com/media/36a067_fd422ec0e0f140d599f55ed51ad2b868~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Costa Rica single origin kahve çekirdeği. Hafif asidite, tatlı karamel ve fıstık notaları.',
    specs: [
      { key: 'Menşei', value: 'Costa Rica' },
      { key: '250g Fiyat', value: '330,85 ₺' },
      { key: '500g Fiyat', value: '652,60 ₺' },
      { key: '1kg Fiyat', value: '1.287,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-guatemala-antigua',
    name: 'Guatemala Antigua',
    slug: 'guatemala-antigua-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 280.8,
    priceMax: 1086.8,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'guatemala', 'single-origin', 'central-america'],
    images: ['https://static.wixstatic.com/media/36a067_48e4bce27ee543109f35b3658bbb4738~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Guatemala Antigua bölgesinden single origin kahve. Çiçekli aroma, orta ağırlık ve dengeli tat.',
    specs: [
      { key: 'Menşei', value: 'Guatemala – Antigua' },
      { key: '250g Fiyat', value: '280,80 ₺' },
      { key: '500g Fiyat', value: '552,50 ₺' },
      { key: '1kg Fiyat', value: '1.086,80 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-colombia-supremo',
    name: 'Colombia Supremo',
    slug: 'colombia-supremo-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 237.54,
    priceMax: 913.77,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'colombia', 'single-origin', 'south-america'],
    images: ['https://static.wixstatic.com/media/36a067_7f5882bdee0546cb9b88b273ca47cceb~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Kolombiya Supremo kalite kahve çekirdeği. Dengeli asidite, fıstık ve çikolata notaları ile.',
    specs: [
      { key: 'Menşei', value: 'Colombia' },
      { key: 'Grade', value: 'Supremo' },
      { key: '250g Fiyat', value: '237,54 ₺' },
      { key: '500g Fiyat', value: '465,99 ₺' },
      { key: '1kg Fiyat', value: '913,77 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-ethiopia-sidamo',
    name: 'Ethiopia Sidamo',
    slug: 'ethiopia-sidamo-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 219.31,
    priceMax: 840.84,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'ethiopia', 'single-origin', 'african'],
    images: ['https://static.wixstatic.com/media/36a067_6a1e7570e8ff417182ceb90a91c69fa6~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Etiyopya Sidamo bölgesinden single origin kahve. Çiçeksi aroma, limon ve beri notaları.',
    specs: [
      { key: 'Menşei', value: 'Ethiopia – Sidamo' },
      { key: '250g Fiyat', value: '219,31 ₺' },
      { key: '500g Fiyat', value: '429,52 ₺' },
      { key: '1kg Fiyat', value: '840,84 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-brasil-santos',
    name: 'Brasil Santos',
    slug: 'brasil-santos-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 205.73,
    priceMax: 786.5,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'brazil', 'santos', 'single-origin'],
    images: ['https://static.wixstatic.com/media/36a067_817030c7ecab4a75a3d9e385aec97bf2~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Brezilya Santos single origin kahve çekirdeği. Fındık ve kakao notaları, düşük asidite.',
    specs: [
      { key: 'Menşei', value: 'Brazil – Santos' },
      { key: '250g Fiyat', value: '205,73 ₺' },
      { key: '500g Fiyat', value: '402,35 ₺' },
      { key: '1kg Fiyat', value: '786,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-ethiopia-burtukaana',
    name: 'Ethiopia Burtukaana',
    slug: 'ethiopia-burtukaana-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 473.85,
    priceMax: 1859.0,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'ethiopia', 'single-origin', 'african', 'specialty'],
    images: ['https://static.wixstatic.com/media/36a067_925d4e24fa344538bb531e6acd95d3ad~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Etiyopya Burtukaana özel lot specialty kahve. Nadir bulunan, komplex aroma profili ile.',
    specs: [
      { key: 'Menşei', value: 'Ethiopia – Burtukaana' },
      { key: '250g Fiyat', value: '473,85 ₺' },
      { key: '500g Fiyat', value: '938,60 ₺' },
      { key: '1kg Fiyat', value: '1.859,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-ethiopia-magarissa',
    name: 'Ethiopia Magarissa',
    slug: 'ethiopia-magarissa-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 473.85,
    priceMax: 1859.0,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'ethiopia', 'single-origin', 'african', 'specialty'],
    images: ['https://static.wixstatic.com/media/36a067_fd422ec0e0f140d599f55ed51ad2b868~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Etiyopya Magarissa bölgesinden specialty grade kahve çekirdeği. Exotic aroma ve tatlı bitiş.',
    specs: [
      { key: 'Menşei', value: 'Ethiopia – Magarissa' },
      { key: '250g Fiyat', value: '473,85 ₺' },
      { key: '500g Fiyat', value: '938,60 ₺' },
      { key: '1kg Fiyat', value: '1.859,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-cuba-cerrano',
    name: 'Cuba Cerrano',
    slug: 'cuba-cerrano-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 420.23,
    priceMax: 1644.5,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'cuba', 'single-origin', 'caribbean'],
    images: ['https://static.wixstatic.com/media/36a067_d601a6b83e18460296fac6a7cab11c8c~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Küba Cerrano bölgesinden rare single origin kahve. Karaib adalarının özel tatı.',
    specs: [
      { key: 'Menşei', value: 'Cuba – Cerrano' },
      { key: '250g Fiyat', value: '420,23 ₺' },
      { key: '500g Fiyat', value: '831,35 ₺' },
      { key: '1kg Fiyat', value: '1.644,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-guatemala-finca',
    name: 'Guatemala Finca',
    slug: 'guatemala-finca-top-roasters',
    categoryId: 'coffee',
    brand: 'Top Roasters',
    priceMin: 420.23,
    priceMax: 1644.5,
    vendorId: 'top-roasters',
    tags: ['yöresel', 'top-roasters', 'guatemala', 'single-origin', 'finca', 'central-america'],
    images: ['https://static.wixstatic.com/media/36a067_9581e01730dc4966a5e198f4352dfcb8~mv2.png/v1/fit/w_4000,h_4001,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Guatemala Finca özel üretim kahve çekirdeği. El toplamanın sağladığı üstün kalite.',
    specs: [
      { key: 'Menşei', value: 'Guatemala – Finca' },
      { key: '250g Fiyat', value: '420,23 ₺' },
      { key: '500g Fiyat', value: '831,35 ₺' },
      { key: '1kg Fiyat', value: '1.644,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  // ─── TOP ROASTERS – ÇAY ÇEŞİTLERİ ───────────────────────────
  {
    id: 'tr-yesil-cay',
    name: 'Yeşil Çay',
    slug: 'yesil-cay-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 40.5,
    priceMax: 154.5,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'yeşil-çay', 'green-tea'],
    images: ['https://static.wixstatic.com/media/36a067_93595e2b4b2c40e49076dd9293d4cb11~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Kaliteli yeşil çay yaprakları. Antioksidan zengini, tatlı ve hafif aroma ile.',
    specs: [
      { key: 'Tip', value: 'Green Tea' },
      { key: '250g Fiyat', value: '40,50 ₺' },
      { key: '500g Fiyat', value: '79,50 ₺' },
      { key: '1kg Fiyat', value: '154,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-yesil-matcha',
    name: 'Yeşil Çay Matcha',
    slug: 'yesil-cay-matcha-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 40.5,
    priceMax: 154.5,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'matcha', 'yeşil-çay'],
    images: ['https://static.wixstatic.com/media/36a067_93595e2b4b2c40e49076dd9293d4cb11~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'İnce öğütülmüş matcha çay tozu. Latte ve smoothie yapımı için ideal.',
    specs: [
      { key: 'Tip', value: 'Matcha' },
      { key: '250g Fiyat', value: '40,50 ₺' },
      { key: '500g Fiyat', value: '79,50 ₺' },
      { key: '1kg Fiyat', value: '154,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-matcha-ceremony',
    name: 'Yeşil Çay Matcha Ceremony',
    slug: 'yesil-cay-matcha-ceremony-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 40.5,
    priceMax: 154.5,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'matcha', 'premium', 'ceremony'],
    images: ['https://static.wixstatic.com/media/36a067_93595e2b4b2c40e49076dd9293d4cb11~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Premium kalite ceremony grade matcha. Japonya matcha seremonisi için uygun, kafe kullanımı için de ideal.',
    specs: [
      { key: 'Tip', value: 'Matcha Ceremony (Premium)' },
      { key: '250g Fiyat', value: '40,50 ₺' },
      { key: '500g Fiyat', value: '79,50 ₺' },
      { key: '1kg Fiyat', value: '154,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-rooibos',
    name: 'Rooibos (Red Bush Tea)',
    slug: 'rooibos-red-bush-tea-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 40.5,
    priceMax: 154.5,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'rooibos', 'kafeinsiz'],
    images: ['https://static.wixstatic.com/media/36a067_c497dbf3ffa54bc9972415dc0cbfd1eb~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Güney Afrika kökenli kafeinsiz rooibos çay. Doğal tatlı tat, antioksidan zengini.',
    specs: [
      { key: 'Tip', value: 'Rooibos / Red Bush' },
      { key: 'Kafein', value: 'Yok' },
      { key: '250g Fiyat', value: '40,50 ₺' },
      { key: '500g Fiyat', value: '79,50 ₺' },
      { key: '1kg Fiyat', value: '154,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-turk-cay',
    name: 'Türk Çay',
    slug: 'turk-cay-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 23.8,
    priceMax: 89.5,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'türk-çay', 'klasik'],
    images: ['https://static.wixstatic.com/media/36a067_c497dbf3ffa54bc9972415dc0cbfd1eb~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Klasik Türk çay. Geleneksel demlenme yönteminin ideal çay yaprakları.',
    specs: [
      { key: 'Tip', value: 'Classic Turkish Tea' },
      { key: '250g Fiyat', value: '23,80 ₺' },
      { key: '500g Fiyat', value: '46,50 ₺' },
      { key: '1kg Fiyat', value: '89,50 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-turk-cay-premium',
    name: 'Türk Çay Premium',
    slug: 'turk-cay-premium-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 28.0,
    priceMax: 104.0,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'türk-çay', 'premium'],
    images: ['https://static.wixstatic.com/media/36a067_c497dbf3ffa54bc9972415dc0cbfd1eb~mv2.png/v1/fit/w_500,h_500,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Premium kalite Türk çay. Üstün yaprak seçimi ile hazırlanmış, zengin aroma.',
    specs: [
      { key: 'Tip', value: 'Premium Turkish Tea' },
      { key: '250g Fiyat', value: '28,00 ₺' },
      { key: '500g Fiyat', value: '54,50 ₺' },
      { key: '1kg Fiyat', value: '104,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-ada-cay',
    name: 'Ada Çayı',
    slug: 'ada-cay-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 32.5,
    priceMax: 122.0,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'ada-çayı', 'sage', 'herbal'],
    images: ['https://static.wixstatic.com/media/36a067_7f2235f3348247cebebddf6a2004fc31~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Sage (Ada) yapraklarından yapılan geleneksel bitki çayı. Antioksidan zengini, hazm düzenleyici.',
    specs: [
      { key: 'Tip', value: 'Sage Tea' },
      { key: '250g Fiyat', value: '32,50 ₺' },
      { key: '500g Fiyat', value: '63,50 ₺' },
      { key: '1kg Fiyat', value: '122,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
  {
    id: 'tr-nar-cay',
    name: 'Nar Çayı',
    slug: 'nar-cay-top-roasters',
    categoryId: 'tea',
    brand: 'Top Roasters',
    priceMin: 35.0,
    priceMax: 132.0,
    vendorId: 'top-roasters',
    tags: ['çay', 'top-roasters', 'nar', 'pomegranate', 'herbal'],
    images: ['https://static.wixstatic.com/media/36a067_7f2235f3348247cebebddf6a2004fc31~mv2.png/v1/fit/w_1024,h_1024,q_90/file.png'],
    moq: 1,
    leadTimeDays: 3,
    availability: 'in_stock',
    description:
      'Nar meyvesinden yapılan aromatik çay. Tatlı-ekşi tat, C vitamini zengini.',
    specs: [
      { key: 'Tip', value: 'Pomegranate Tea' },
      { key: '250g Fiyat', value: '35,00 ₺' },
      { key: '500g Fiyat', value: '68,50 ₺' },
      { key: '1kg Fiyat', value: '132,00 ₺' },
      { key: 'KDV', value: 'Dahil Değil' },
    ],
    createdAt: '2025-02-24',
  },
]

// Admin-stored products (local fallback — Supabase path is in admin-products.ts)
function getAdminStoredProducts(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('kafe-market-admin-products')
    if (stored) return JSON.parse(stored) as Product[]
  } catch {
    // ignore
  }
  return []
}

// Ürünlere kategori ve vendor bilgilerini ekle
export function getProductWithRelations(product: Product): Product {
  return {
    ...product,
    category: getCategoryById(product.categoryId),
    vendor: getVendorById(product.vendorId),
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  const allProducts = [...products, ...getAdminStoredProducts()]
  const product = allProducts.find((p) => p.slug === slug)
  if (product) {
    return getProductWithRelations(product)
  }
  return undefined
}

export function getProductById(id: string): Product | undefined {
  const allProducts = [...products, ...getAdminStoredProducts()]
  const product = allProducts.find((p) => p.id === id)
  if (product) {
    return getProductWithRelations(product)
  }
  return undefined
}

export interface CatalogOverrides {
  /** product id → isActive */
  moderation: Record<string, { isActive: boolean }>
  /** extra products fetched from Supabase admin_products table */
  adminProducts: Product[]
}

function resolveAllProducts(extra: Product[]): Product[] {
  // merge mock products with Supabase/localStorage admin products
  const localAdmin = getAdminStoredProducts()
  // prefer Supabase (extra) over localStorage when both are present
  const adminList = extra.length > 0 ? extra : localAdmin
  return [...products, ...adminList]
}

function applyModerationFilter(
  list: Product[],
  moderation: Record<string, { isActive: boolean }>
): Product[] {
  return list.filter((p) => {
    const mod = moderation[p.id]
    return mod ? mod.isActive !== false : true
  })
}

function getLocalModeration(): Record<string, { isActive: boolean }> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem('kafe-market-product-moderation')
    return stored
      ? (JSON.parse(stored) as Record<string, { isActive: boolean }>)
      : {}
  } catch {
    return {}
  }
}

// Filtreleme ve sayfalama
export function getProducts(
  params: FilterParams,
  overrides?: CatalogOverrides
): PaginatedResult<Product> {
  const pageSize = 12
  const page = params.page || 1

  let filtered = resolveAllProducts(overrides?.adminProducts ?? [])

  // Filter out hidden products
  const moderation = overrides?.moderation ?? getLocalModeration()
  filtered = applyModerationFilter(filtered, moderation)

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
export function getBrands(extra: Product[] = []): string[] {
  const brands = new Set(resolveAllProducts(extra).map((p) => p.brand))
  return Array.from(brands).sort()
}

// Featured ürünler
export function getFeaturedProducts(overrides?: CatalogOverrides): Product[] {
  let filtered = resolveAllProducts(overrides?.adminProducts ?? []).filter(
    (p) => p.featured
  )
  const moderation = overrides?.moderation ?? getLocalModeration()
  filtered = applyModerationFilter(filtered, moderation)
  return filtered.map(getProductWithRelations).slice(0, 4)
}
