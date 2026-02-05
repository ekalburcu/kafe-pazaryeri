export interface ImportedProduct {
  name: string
  categoryId: string
  brand: string
  vendorId: string
  priceMin: number
  priceMax: number
  description: string
  tags: string[]
  specs: { key: string; value: string }[]
}

// Parse Turkish number format: "1.859,00" → 1859
export function parseTurkishNumber(str: string): number {
  const cleaned = str.replace(/[₺\s]/g, '').replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

// ─── CSV ────────────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

function parseSpecsString(str: string): { key: string; value: string }[] {
  if (!str) return []
  return str
    .split(';')
    .map((s) => {
      const [key, ...rest] = s.split(':')
      return { key: (key || '').trim(), value: rest.join(':').trim() }
    })
    .filter((s) => s.key && s.value)
}

export async function parseCSV(file: File): Promise<ImportedProduct[]> {
  const text = await file.text()
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  const products: ImportedProduct[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || '').trim()
    })

    const name = row['ürün adı'] || row['name'] || ''
    if (!name) continue

    products.push({
      name,
      categoryId: row['kategori'] || row['category'] || 'coffee',
      brand: row['marka'] || row['brand'] || '',
      vendorId: row['tedarikçi'] || row['vendor'] || '',
      priceMin: parseTurkishNumber(row['min fiyat'] || row['price_min'] || '0'),
      priceMax: parseTurkishNumber(row['max fiyat'] || row['price_max'] || '0'),
      description: row['açıklama'] || row['description'] || '',
      tags: (row['etiketler'] || row['tags'] || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      specs: parseSpecsString(row['özellikler'] || row['specs'] || ''),
    })
  }

  return products
}

// ─── PDF ────────────────────────────────────────────────────────

export async function extractPDFText(file: File): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib: any = await import('pdfjs-dist')
  const lib = pdfjsLib.default || pdfjsLib
  lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await lib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .filter((item: { str?: string }) => 'str' in item)
      .map((item: { str: string }) => item.str)
      .join(' ')
    fullText += `--- Sayfa ${i} ---\n${pageText}\n`
  }

  return fullText
}

// ─── CSV Template ──────────────────────────────────────────────

export function downloadCSVTemplate(): void {
  const headers = [
    'Ürün Adı',
    'Kategori',
    'Marka',
    'Tedarikçi',
    'Min Fiyat',
    'Max Fiyat',
    'Açıklama',
    'Etiketler',
    'Özellikler',
  ]
  const example = [
    'Örnek Kahve',
    'coffee',
    'Marka Adı',
    'kahve-dunyasi',
    '100',
    '200',
    'Ürün açıklaması',
    'tag1,tag2',
    'Ağırlık:1kg;Menşei:Türkiye',
  ]

  const csv = [headers, example]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'urun-sablonu.csv'
  a.click()
  URL.revokeObjectURL(url)
}
