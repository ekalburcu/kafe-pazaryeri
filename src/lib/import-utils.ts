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
  imageDataUrl?: string // matched product image from PDF
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

type PdfTextItem = { str: string; x: number; y: number; width: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadPdf(file: File): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib: any = await import('pdfjs-dist')
  const lib = pdfjsLib.default || pdfjsLib
  lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  const arrayBuffer = await file.arrayBuffer()
  return lib.getDocument({ data: arrayBuffer }).promise
}

// Build text rows from an already-fetched textContent object (sync).
// Gap thresholds (PDF points): <2 = same word, 2–20 = word space, ≥20 = column
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPageRows(textContent: any): string[][] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: PdfTextItem[] = textContent.items
    .filter((it: { str?: string }) => 'str' in it && (it as { str: string }).str !== '')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((it: any) => ({
      str: it.str as string,
      x: it.transform[4] as number,
      y: it.transform[5] as number,
      width: (it.width || 0) as number,
    }))

  const rows: { y: number; items: PdfTextItem[] }[] = []
  for (const item of items) {
    const row = rows.find((r) => Math.abs(r.y - item.y) < 3)
    if (row) row.items.push(item)
    else rows.push({ y: item.y, items: [item] })
  }
  rows.sort((a, b) => b.y - a.y)

  return rows.map((row) => {
    row.items.sort((a, b) => a.x - b.x)
    const cols: string[] = []
    let current = ''
    for (let j = 0; j < row.items.length; j++) {
      const item = row.items[j]
      if (j === 0) {
        current = item.str
      } else {
        const prev = row.items[j - 1]
        const gap = item.x - (prev.x + prev.width)
        if (gap < 2) current += item.str
        else if (gap < 20) current += ' ' + item.str
        else { cols.push(current.trim()); current = item.str }
      }
    }
    if (current.trim()) cols.push(current.trim())
    return cols
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function extractPageRows(page: any): Promise<string[][]> {
  return buildPageRows(await page.getTextContent())
}

export async function extractPDFText(file: File): Promise<string> {
  const pdf = await loadPdf(file)
  const lines: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const rows = await extractPageRows(page)
    for (const cols of rows) {
      if (cols.length) lines.push(cols.join('\t'))
    }
  }
  return lines.join('\n')
}

// Turkish price pattern: 1.500,00 or 1500 or 45,50
function parsePriceCell(str: string): number {
  const cleaned = str.replace(/[₺\sTL]/g, '').trim()
  if (/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$/.test(cleaned) || /^\d+(?:,\d{1,2})?$/.test(cleaned)) {
    return parseTurkishNumber(cleaned)
  }
  return 0
}

// ─── Catalog-style PDF parser (e.g. Narkar Çay price list) ────────────────────
// These PDFs use a brochure/catalog layout: each product is a free-text block,
// not a table row. Strategy:
//   1. Collect all text rows from all pages, removing headers/footers.
//   2. Find rows that contain a price (₺).
//   3. Walk backwards from each price row to collect the product name.

const CATALOG_JUNK = [
  /özel\s*fiyat\s*list/i,
  /^tarih\s*:/i,
  /bölge\s*müdürlüğü/i,
  /mevlana\s*mah/i,
  /sancaktar\s*cad/i,
  /hancaymarket/i,
  /horecasektor/i,
  /^gsm\s*:/i,
  /yenidoğan/i,
  /^narkar\s*çay$/i, // standalone page-header "NARKAR ÇAY"
]

function extractKoliPrice(text: string): number {
  // Matches "5400₺" but NOT "450₺/KG"
  const m = text.match(/(\d[\d.]*(?:,\d{1,2})?)\s*₺(?!\s*\/)/i)
  return m ? parseTurkishNumber(m[1]) : 0
}

function extractKgPrice(text: string): number {
  const m = text.match(/(\d[\d.]*(?:,\d{1,2})?)\s*₺\s*\/\s*KG/i)
  return m ? parseTurkishNumber(m[1]) : 0
}

function isDetailRow(cols: string[]): boolean {
  const text = cols.join(' ').trim()
  return (
    cols[0]?.trim().startsWith('*') ||
    /bulunmaktadır/i.test(text) ||
    /\d+\s*adet/i.test(text) ||
    /koli\s+içerisinde/i.test(text)
  )
}

function isSectionHeaderRow(cols: string[]): boolean {
  return /modeller[iı]/i.test(cols.join(' '))
}

export async function parsePDFProducts(file: File): Promise<ImportedProduct[]> {
  const pdf = await loadPdf(file)

  // Collect non-empty rows from all pages
  const allRows: string[][] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const rows = await extractPageRows(page)
    for (const r of rows) {
      if (r.some((c) => c.trim())) allRows.push(r)
    }
  }

  const catalogRows = allRows.filter(
    (cols) => !CATALOG_JUNK.some((re) => re.test(cols.join(' ')))
  )
  const catalogProducts = extractProductsFromRows(catalogRows)
  if (catalogProducts.length > 0) return catalogProducts

  // Fallback: table format (TL prices)
  return extractProductsFromTableRows(allRows)
}

// ─── Table-format PDF parser (e.g. Discover price list) ──────────────────────
// These PDFs use a table layout: product name on one line, then
// PRODUCT_CODE PRICE TL KDV% QUANTITY on the next line.

const TABLE_JUNK = [
  /^sayfa\s*\d/i,
  /fiyat\s*güncelleme/i,
  /revizyon\s*:/i,
  /^ürün\s*adı/i,
  /resmi\s*kod/i,
  /kdv\s*dahil/i,
  /adet.*karton/i,
  /katalog\s*sayfa/i,
  /^fiyat\s*listesi$/i,
  /fiyatlarımıza/i,
  /^page\s+\d/i,
]

function extractTLPrice(text: string): number {
  const m = text.match(/(\d[\d.]*(?:,\d{1,2})?)\s*TL\b/i)
  return m ? parseTurkishNumber(m[1]) : 0
}

// Product code: 2+ uppercase letters followed by 3+ digits (e.g. DSR0085)
const TABLE_CODE_RE = /^[A-Z]{2,}\d{3,}/

function isTableProductLine(text: string): boolean {
  return TABLE_CODE_RE.test(text.trim()) && extractTLPrice(text) > 0
}

function extractProductsFromTableRows(allRows: string[][]): ImportedProduct[] {
  const cleanRows = allRows.filter(
    (cols) => !TABLE_JUNK.some((re) => re.test(cols.join(' ')))
  )

  // Detect brand from the document header (short all-caps line near the top)
  let detectedBrand = ''
  for (let i = 0; i < Math.min(15, cleanRows.length); i++) {
    const text = cleanRows[i].join(' ').trim()
    if (text.length > 2 && text.length < 40 && /^[A-ZÇĞİÖŞÜ\s]+$/.test(text)) {
      detectedBrand = text
      break
    }
  }

  const products: ImportedProduct[] = []

  for (let i = 0; i < cleanRows.length; i++) {
    const rowText = cleanRows[i].join(' ').trim()
    if (!isTableProductLine(rowText)) continue

    const price = extractTLPrice(rowText)

    // Product name = nearest previous non-junk, non-detail line
    let name = ''
    for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
      const prev = cleanRows[j].join(' ').trim()
      if (!prev) continue
      if (isTableProductLine(prev)) break
      name = prev
      break
    }
    if (!name || name.length < 3) continue

    // Brand: use detected header brand, or first word of product name
    const brand = detectedBrand || name.split(/\s+/)[0] || ''

    // Optional description from next non-detail line
    let description = ''
    if (i + 1 < cleanRows.length) {
      const next = cleanRows[i + 1].join(' ').trim()
      if (!isTableProductLine(next) && next.length > 2) {
        description = next
      }
    }

    // Specs: product code + KDV rate
    const specs: { key: string; value: string }[] = []
    const codeMatch = rowText.match(/^([A-Z]{2,}\d[\w]*)/i)
    if (codeMatch) specs.push({ key: 'Ürün Kodu', value: codeMatch[1] })
    const kdvMatch = rowText.match(/(\d+)\s*%/)
    if (kdvMatch) specs.push({ key: 'KDV Oranı', value: `%${kdvMatch[1]}` })
    const qtyMatch = rowText.match(/%\s*\d+\s+(\d+)$/)
    if (qtyMatch) specs.push({ key: 'Adet/Karton', value: qtyMatch[1] })

    // Guess category from name/brand
    const lower = (name + ' ' + brand).toLowerCase()
    let categoryId = 'cleaning'
    if (/kahve|espresso|filtre/.test(lower)) categoryId = 'coffee'
    else if (/çay|tea/.test(lower)) categoryId = 'tea'
    else if (/ambalaj|bardak|kap/.test(lower)) categoryId = 'packaging'
    else if (/ekipman|makine/.test(lower)) categoryId = 'equipment'

    products.push({
      name,
      categoryId,
      brand,
      vendorId: '',
      priceMin: price,
      priceMax: price,
      description,
      tags: [],
      specs,
    })
  }

  return products
}

// Shared product-detection logic (used by both parsePDFProducts and parsePDFWithImages)
function extractProductsFromRows(cleanRows: string[][]): ImportedProduct[] {
  const products: ImportedProduct[] = []
  const visitedRows = new Set<number>()

  for (let i = 0; i < cleanRows.length; i++) {
    if (visitedRows.has(i)) continue

    const rowText = cleanRows[i].join(' ')
    let kp = extractKoliPrice(rowText)
    let kgp = extractKgPrice(rowText)
    if (kp === 0 && kgp === 0) continue

    visitedRows.add(i)

    if (kgp === 0) {
      for (let k = Math.max(0, i - 4); k <= Math.min(cleanRows.length - 1, i + 4); k++) {
        if (k === i) continue
        const kg = extractKgPrice(cleanRows[k].join(' '))
        if (kg > 0) { kgp = kg; visitedRows.add(k); break }
      }
    }
    if (kp === 0) {
      for (let k = Math.max(0, i - 4); k <= Math.min(cleanRows.length - 1, i + 2); k++) {
        if (k === i) continue
        const koli = extractKoliPrice(cleanRows[k].join(' '))
        if (koli > 0) { kp = koli; visitedRows.add(k); break }
      }
    }

    const nameLines: string[] = []
    for (let j = i - 1; j >= Math.max(0, i - 8); j--) {
      const prev = cleanRows[j]
      const prevText = prev.join(' ').trim()
      if (!prevText) continue
      if (isSectionHeaderRow(prev)) break
      if (extractKoliPrice(prevText) > 0 || extractKgPrice(prevText) > 0) break
      if (isDetailRow(prev)) continue
      nameLines.unshift(prevText)
    }

    const name = nameLines.filter((l) => l.length > 1).join(' ').trim()
    if (!name || name.length < 3) continue

    const effectivePrice = kp || kgp
    products.push({
      name,
      categoryId: 'tea',
      brand: 'NARKAR ÇAY',
      vendorId: '',
      priceMin: effectivePrice,
      priceMax: effectivePrice,
      description: kgp > 0 ? `${kgp}₺/KG` : '',
      tags: ['çay'],
      specs: kgp > 0 ? [{ key: 'KG Fiyatı', value: `${kgp}₺` }] : [],
    })
  }

  return products
}

// ─── PDF Image Extraction ──────────────────────────────────────

export interface ExtractedImage {
  id: string
  pageNum: number
  imageIndex: number
  dataUrl: string
  width: number
  height: number
  source: 'cropped' | 'page'
}

// ── Border-line trimmer ─────────────────────────────────────────
// Table cell borders are thin rows where >55 % of pixels are near-black.
// After finding the innermost border from each edge, everything outside
// (including partial adjacent-product slices) is cropped away.

function trimAtBorders(src: HTMLCanvasElement): HTMLCanvasElement {
  const { width: w, height: h } = src
  const ctx = src.getContext('2d')!
  const data = ctx.getImageData(0, 0, w, h).data
  const ZONE = Math.floor(h * 0.38) // only scan top / bottom 38 %

  function isDarkLine(y: number): boolean {
    let dark = 0
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (data[i] < 40 && data[i + 1] < 40 && data[i + 2] < 40) dark++
    }
    return dark / w > 0.55
  }

  function isLightRow(y: number): boolean {
    let light = 0
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (data[i] > 215 && data[i + 1] > 215 && data[i + 2] > 215) light++
    }
    return light / w > 0.88
  }

  let topBorder = -1
  for (let y = 0; y < ZONE; y++) {
    if (isDarkLine(y)) { topBorder = y; break }
  }
  let bottomBorder = -1
  for (let y = h - 1; y >= h - ZONE; y--) {
    if (isDarkLine(y)) { bottomBorder = y; break }
  }

  if (topBorder < 0 && bottomBorder < 0) return src

  // Skip ALL dark rows (border may be multi-pixel thick), then white padding
  let top = topBorder >= 0 ? topBorder : 0
  while (top < h - 1 && isDarkLine(top)) top++
  while (top < h - 1 && isLightRow(top)) top++

  let bottom = bottomBorder >= 0 ? bottomBorder : h - 1
  while (bottom > 0 && isDarkLine(bottom)) bottom--
  while (bottom > 0 && isLightRow(bottom)) bottom--

  const nh = bottom - top + 1
  if (nh <= 10) return src

  const out = document.createElement('canvas')
  out.width = w
  out.height = nh
  out.getContext('2d')!.drawImage(src, 0, top, w, nh, 0, 0, w, nh)
  return out
}

// ── Text-layer-based crop refinement ───────────────────────────
// Uses page.getTextContent() to locate all text on the page in canvas
// coordinates, then shrinks each crop rect to exclude overlapping text.

interface TextBox { x: number; y: number; w: number; h: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTextBBoxes(textContent: any, viewport: any): TextBox[] {
  const boxes: TextBox[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const item of textContent.items as any[]) {
    if (!('str' in item) || !item.str.trim()) continue
    const tx = item.transform[4] as number
    const ty = item.transform[5] as number
    const tw = (item.width  || 0) as number
    const th = (item.height || 0) as number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [vx1, vy1] = (viewport as any).convertToViewportPoint(tx,      ty + th)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [vx2, vy2] = (viewport as any).convertToViewportPoint(tx + tw, ty)
    boxes.push({
      x: Math.min(vx1, vx2),
      y: Math.min(vy1, vy2),
      w: Math.abs(vx2 - vx1),
      h: Math.abs(vy2 - vy1),
    })
  }
  return boxes
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getTextBBoxes(page: any, viewport: any): Promise<TextBox[]> {
  return buildTextBBoxes(await page.getTextContent(), viewport)
}

// Adjust a crop rect so that text boxes overlapping its top or bottom are excluded.
// Adds a small padding around the remaining image area.
function shrinkRectFromText(rect: CropRect, textBoxes: TextBox[], pad = 6): CropRect {
  const rectBottom = rect.y + rect.h
  const midY = rect.y + rect.h / 2

  // Text boxes that actually overlap with this rect
  const overlapping = textBoxes.filter(
    (tb) =>
      tb.x < rect.x + rect.w &&
      tb.x + tb.w > rect.x &&
      tb.y < rectBottom &&
      tb.y + tb.h > rect.y,
  )
  if (overlapping.length === 0) return rect

  // Text in the TOP half → push rect.y down past it
  const topText = overlapping.filter((tb) => tb.y + tb.h / 2 < midY)
  // Text in the BOTTOM half → pull rect bottom up
  const bottomText = overlapping.filter((tb) => tb.y + tb.h / 2 >= midY)

  let newY = rect.y
  let newBottom = rectBottom

  if (topText.length > 0) {
    const lowestTopTextBottom = Math.max(...topText.map((tb) => tb.y + tb.h))
    newY = Math.min(lowestTopTextBottom + pad, midY) // never go past midpoint
  }
  if (bottomText.length > 0) {
    const highestBottomTextTop = Math.min(...bottomText.map((tb) => tb.y))
    newBottom = Math.max(highestBottomTextTop - pad, midY) // never go past midpoint
  }

  return { x: rect.x, y: Math.round(newY), w: rect.w, h: Math.round(newBottom - newY) }
}

// Multiply two 6-element PDF transformation matrices [a b c d e f]
function matMul(a: number[], b: number[]): number[] {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ]
}

interface CropRect { x: number; y: number; w: number; h: number }

// Walk the pdfjs operator list tracking the current transform matrix (CTM).
// For every image paint operation, compute the bounding box in viewport (canvas) pixels.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectImageRects(opList: any, OPS: any, viewport: any): CropRect[] {
  const rects: CropRect[] = []
  const stack: number[][] = []
  let ctm = [1, 0, 0, 1, 0, 0]

  // Header = top 18 % of canvas height → repeated page logos live here
  const headerCutoff = viewport.height * 0.18
  // Footer = bottom 8 %
  const footerCutoff = viewport.height * 0.92

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i]
    const args: number[] = opList.argsArray[i]

    if (fn === OPS.save) {
      stack.push([...ctm])
    } else if (fn === OPS.restore) {
      ctm = stack.pop() ?? [1, 0, 0, 1, 0, 0]
    } else if (fn === OPS.transform) {
      ctm = matMul(ctm, [args[0], args[1], args[2], args[3], args[4], args[5]])
    } else if (
      fn === OPS.paintImageXObject ||
      fn === OPS.paintJpegXObject ||
      fn === OPS.paintInlineImageXObject ||
      fn === OPS.paintImageMaskXObject
    ) {
      const corners: [number, number][] = [
        [ctm[4],                      ctm[5]],
        [ctm[4] + ctm[0],             ctm[5] + ctm[1]],
        [ctm[4] + ctm[2],             ctm[5] + ctm[3]],
        [ctm[4] + ctm[0] + ctm[2],   ctm[5] + ctm[1] + ctm[3]],
      ]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vCorners = corners.map(([x, y]) => (viewport as any).convertToViewportPoint(x, y))
      const xs = vCorners.map(([px]: number[]) => px)
      const ys = vCorners.map(([, py]: number[]) => py)

      const x = Math.round(Math.min(...xs))
      const y = Math.round(Math.min(...ys))
      const w = Math.round(Math.max(...xs) - Math.min(...xs))
      const h = Math.round(Math.max(...ys) - Math.min(...ys))

      // Skip tiny elements AND anything whose center sits in the header or footer band
      const cy = y + h / 2
      if (w < 100 || h < 100) continue
      if (cy < headerCutoff || cy > footerCutoff) continue

      rects.push({ x, y, w, h })
    }
  }

  return rects
}

// Deduplicate rects whose overlap exceeds 70 % of the smaller rect's area.
// Also deduplicates across pages: "seenRelative" tracks (relX, relY, relW, relH)
// rounded to 2 % grid so header logos that repeat each page are filtered out.
const _seenRelative = new Set<string>()

function resetDedup() { _seenRelative.clear() }

function dedupeRects(rects: CropRect[], canvasW: number, canvasH: number): CropRect[] {
  const out: CropRect[] = []
  for (const r of rects) {
    // Within-page overlap check
    const localDupe = out.some((o) => {
      const ix = Math.max(0, Math.min(r.x + r.w, o.x + o.w) - Math.max(r.x, o.x))
      const iy = Math.max(0, Math.min(r.y + r.h, o.y + o.h) - Math.max(r.y, o.y))
      const overlap = ix * iy
      const smaller = Math.min(r.w * r.h, o.w * o.h)
      return overlap / smaller > 0.7
    })
    if (localDupe) continue

    // Cross-page dedup: same relative position ± 2 % → repeated element (logo/header)
    const rx = Math.round((r.x / canvasW) * 50)
    const ry = Math.round((r.y / canvasH) * 50)
    const rw = Math.round((r.w / canvasW) * 50)
    const rh = Math.round((r.h / canvasH) * 50)
    const key = `${rx},${ry},${rw},${rh}`
    if (_seenRelative.has(key)) continue
    _seenRelative.add(key)

    out.push(r)
  }
  return out
}

export async function extractPDFImages(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<ExtractedImage[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib: any = await import('pdfjs-dist')
  const lib = pdfjsLib.default || pdfjsLib
  lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await lib.getDocument({ data: arrayBuffer }).promise
  const OPS = lib.OPS

  // Render at 3× for sharp crops
  const SCALE = 3
  const results: ExtractedImage[] = []
  resetDedup() // clear cross-page duplicate tracker for this extraction run

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress?.(pageNum, pdf.numPages)
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: SCALE })

    // Render full page to canvas
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise

    // Get text boxes and operator list (both use already-loaded page data)
    const [opList, textBoxes] = await Promise.all([
      page.getOperatorList(),
      getTextBBoxes(page, viewport),
    ])
    const rawRects = dedupeRects(collectImageRects(opList, OPS, viewport), canvas.width, canvas.height)
    const rects = rawRects.map((r) => shrinkRectFromText(r, textBoxes))

    if (rects.length === 0) {
      // Fallback: include full page render so the user always gets something
      results.push({
        id: `p${pageNum}-full`,
        pageNum,
        imageIndex: 0,
        dataUrl: canvas.toDataURL('image/jpeg', 0.85),
        width: canvas.width,
        height: canvas.height,
        source: 'page',
      })
      continue
    }

    for (let idx = 0; idx < rects.length; idx++) {
      const { x, y, w, h } = rects[idx]
      // Clamp to canvas bounds
      const sx = Math.max(0, x)
      const sy = Math.max(0, y)
      const sw = Math.min(w, canvas.width - sx)
      const sh = Math.min(h, canvas.height - sy)
      if (sw <= 0 || sh <= 0) continue

      const crop = document.createElement('canvas')
      crop.width = sw
      crop.height = sh
      crop.getContext('2d')!.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh)

      // Remove table border lines + partial adjacent-product slices
      const final = trimAtBorders(crop)

      results.push({
        id: `p${pageNum}-img${idx}`,
        pageNum,
        imageIndex: idx,
        dataUrl: final.toDataURL('image/jpeg', 0.9),
        width: final.width,
        height: final.height,
        source: 'cropped',
      })
    }
  }

  return results
}

// ─── Combined PDF product + image extraction ───────────────────
// Processes each page once, extracting products AND images together,
// then matches them by vertical order (product[i] ↔ image[i] on same page).

export async function parsePDFWithImages(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<ImportedProduct[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib: any = await import('pdfjs-dist')
  const lib = pdfjsLib.default || pdfjsLib
  lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await lib.getDocument({ data: arrayBuffer }).promise
  const OPS = lib.OPS
  const SCALE = 3

  resetDedup()
  const allProducts: ImportedProduct[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress?.(pageNum, pdf.numPages)
    const page = await pdf.getPage(pageNum)

    // One getTextContent call shared by both text + image steps
    const textContent = await page.getTextContent()

    // ── Images ──────────────────────────────────────────────────
    const viewport = page.getViewport({ scale: SCALE })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise

    const opList = await page.getOperatorList()
    const textBoxes = buildTextBBoxes(textContent, viewport)
    const rawRects = dedupeRects(
      collectImageRects(opList, OPS, viewport),
      canvas.width,
      canvas.height,
    )
    const pageImgDataUrls: string[] = []
    for (const rect of rawRects.map((r) => shrinkRectFromText(r, textBoxes))) {
      const sx = Math.max(0, rect.x)
      const sy = Math.max(0, rect.y)
      const sw = Math.min(rect.w, canvas.width - sx)
      const sh = Math.min(rect.h, canvas.height - sy)
      if (sw <= 0 || sh <= 0) continue
      const crop = document.createElement('canvas')
      crop.width = sw; crop.height = sh
      crop.getContext('2d')!.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh)
      pageImgDataUrls.push(trimAtBorders(crop).toDataURL('image/jpeg', 0.9))
    }

    // ── Products ─────────────────────────────────────────────────
    const rows = buildPageRows(textContent)
    const nonEmptyRows = rows.filter((cols) => cols.some((c) => c.trim()))
    // Try catalog format (₺) first, then table format (TL)
    const catalogRows = nonEmptyRows.filter(
      (cols) => !CATALOG_JUNK.some((re) => re.test(cols.join(' ')))
    )
    const catalogProducts = extractProductsFromRows(catalogRows)
    const pageProducts =
      catalogProducts.length > 0
        ? catalogProducts
        : extractProductsFromTableRows(nonEmptyRows)

    // ── Match by index (both are top→bottom on the page) ─────────
    pageProducts.forEach((p, i) => {
      if (pageImgDataUrls[i]) p.imageDataUrl = pageImgDataUrls[i]
    })

    allProducts.push(...pageProducts)
  }

  return allProducts
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
