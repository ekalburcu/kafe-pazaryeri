'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, X, Image as ImageIcon, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { extractPDFImages, ExtractedImage } from '@/lib/import-utils'

interface PdfImageExtractorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PdfImageExtractorModal({ open, onOpenChange }: PdfImageExtractorModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [images, setImages] = useState<ExtractedImage[]>([])
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setFile(null)
    setImages([])
    setProgress(null)
    setError(null)
  }

  const handleFile = useCallback(async (selected: File) => {
    if (!selected.name.endsWith('.pdf') && selected.type !== 'application/pdf') {
      setError('Yalnızca PDF dosyası desteklenir.')
      return
    }
    setFile(selected)
    setError(null)
    setImages([])
    setProgress({ current: 0, total: 0 })

    try {
      const extracted = await extractPDFImages(selected, (page, total) => {
        setProgress({ current: page, total })
      })
      setImages(extracted)
      if (extracted.length === 0) setError('PDF içinde görsel bulunamadı.')
    } catch {
      setError('Görseller çıkarılırken hata oluştu.')
    } finally {
      setProgress(null)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile],
  )

  const downloadImage = (img: ExtractedImage) => {
    const a = document.createElement('a')
    a.href = img.dataUrl
    a.download = `gorsel-sayfa${img.pageNum}-${img.imageIndex + 1}.jpg`
    a.click()
  }

  const downloadAll = () => {
    images.forEach((img, i) => {
      setTimeout(() => downloadImage(img), i * 150)
    })
  }

  const embeddedCount = images.filter((i) => i.source === 'cropped').length
  const pageCount = images.filter((i) => i.source === 'page').length

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) reset()
        onOpenChange(val)
      }}
    >
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>PDF Görsel Çıkarıcı</DialogTitle>
          <DialogDescription>
            PDF&apos;e ait gömülü görseller otomatik ayrıştırılır ve indirmeye hazır hale getirilir.
          </DialogDescription>
        </DialogHeader>

        {/* Drop zone */}
        {!file && (
          <div
            className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">PDF&apos;i sürükleyin veya tıklayın</p>
            <p className="text-xs text-muted-foreground mt-1">Desteklenen format: .pdf</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
          </div>
        )}

        {/* Active file */}
        {file && (
          <div className="flex items-center gap-2 p-2 border rounded-lg">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm flex-1 truncate">{file.name}</span>
            <Button variant="ghost" size="icon" onClick={reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Progress */}
        {progress && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground text-center">
              Sayfa {progress.current} / {progress.total || '?'} işleniyor…
            </p>
            {progress.total > 0 && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Results header */}
        {images.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">{images.length} görsel bulundu</span>
              {embeddedCount > 0 && (
                <Badge variant="default">{embeddedCount} crop edildi</Badge>
              )}
              {pageCount > 0 && (
                <Badge variant="secondary">{pageCount} sayfa render</Badge>
              )}
            </div>
            <Button size="sm" onClick={downloadAll}>
              <Download className="mr-2 h-3 w-3" />
              Tümünü İndir
            </Button>
          </div>
        )}

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative border rounded-lg overflow-hidden bg-muted aspect-square flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt={`Sayfa ${img.pageNum} görsel ${img.imageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p className="text-white text-xs font-medium text-center px-1">
                    Sayfa {img.pageNum} · {img.width}×{img.height}
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadImage(img)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    İndir
                  </Button>
                </div>
                {img.source !== 'cropped' && (
                  <Badge
                    variant="outline"
                    className="absolute top-1 left-1 text-[10px] py-0 px-1 bg-background/80"
                  >
                    Sayfa
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom upload button when no file yet */}
        {!file && !progress && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              PDF Seç
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
