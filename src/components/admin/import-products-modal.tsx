'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  parseCSV,
  extractPDFText,
  downloadCSVTemplate,
  ImportedProduct,
} from '@/lib/import-utils'
import { getAllCategories } from '@/lib/data/categories'

interface ImportProductsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (products: ImportedProduct[]) => void
}

export function ImportProductsModal({
  open,
  onOpenChange,
  onImport,
}: ImportProductsModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [csvProducts, setCsvProducts] = useState<ImportedProduct[]>([])
  const [pdfText, setPdfText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = getAllCategories()

  const handleFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    setCsvProducts([])
    setPdfText(null)
    setIsProcessing(true)

    try {
      if (selectedFile.name.endsWith('.csv') || selectedFile.type === 'text/csv') {
        const products = await parseCSV(selectedFile)
        if (products.length === 0) {
          setError('CSV dosyasında ürün bulunamadı. Şablonu kullanıyorsanız doldurunuz.')
        } else {
          setCsvProducts(products)
        }
      } else if (
        selectedFile.name.endsWith('.pdf') ||
        selectedFile.type === 'application/pdf'
      ) {
        const text = await extractPDFText(selectedFile)
        if (!text.trim()) {
          setError('PDF dosyasından metin çıkarılamadı.')
        } else {
          setPdfText(text)
        }
      } else {
        setError('Desteklenen dosya türleri: CSV, PDF')
      }
    } catch {
      setError('Dosya işleme sırasında hata oluştu.')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const reset = () => {
    setFile(null)
    setCsvProducts([])
    setPdfText(null)
    setError(null)
  }

  const handleImport = () => {
    if (csvProducts.length > 0) {
      onImport(csvProducts)
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) reset()
        onOpenChange(val)
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ürün İmport</DialogTitle>
          <DialogDescription>
            CSV veya PDF dosyası yükleyerek ürün listesi ekleyin
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={downloadCSVTemplate}>
            <Download className="mr-2 h-3 w-3" />
            CSV Şablonu İndir
          </Button>
        </div>

        {!file ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Dosyayı sürükleyin veya burada tıklayın
            </p>
            <p className="text-xs text-muted-foreground mt-1">.csv veya .pdf</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 border rounded-lg">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1 truncate">{file.name}</span>
            <Button variant="ghost" size="icon" onClick={reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isProcessing && (
          <p className="text-sm text-center text-muted-foreground py-4">İşleniyor...</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {csvProducts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{csvProducts.length} ürün bulunan</p>
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium">Ürün</th>
                      <th className="text-left p-2 font-medium">Marka</th>
                      <th className="text-left p-2 font-medium">Kategori</th>
                      <th className="text-right p-2 font-medium">Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvProducts.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{p.name}</td>
                        <td className="p-2 text-muted-foreground">{p.brand}</td>
                        <td className="p-2">
                          <Badge variant="secondary">
                            {categories.find((c) => c.id === p.categoryId)?.name ||
                              p.categoryId}
                          </Badge>
                        </td>
                        <td className="p-2 text-right text-muted-foreground">
                          {p.priceMin} – {p.priceMax} ₺
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {pdfText && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              PDF metin çıkarıldı. Yapılandırılmış import için CSV şablonunu kullanmanız
              önerilir.
            </p>
            <textarea
              className="w-full h-48 p-2 border rounded-lg text-xs font-mono resize-none bg-muted"
              value={pdfText}
              readOnly
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleImport} disabled={csvProducts.length === 0}>
            {csvProducts.length > 0 ? `${csvProducts.length} Ürün Ekle` : 'İmport'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
