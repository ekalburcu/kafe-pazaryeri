'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import {
  FileText,
  Eye,
  Clock,
  CheckCircle,
  Send,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'
import { VendorLayout } from '@/components/vendor/vendor-layout'
import { useAuth } from '@/context/auth-context'
import { getRequestsByVendorId } from '@/lib/data/requests'
import { OrderRequest, RequestStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'

const statusConfig: Record<
  RequestStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }
> = {
  draft: { label: 'Taslak', variant: 'outline', icon: Clock },
  sent: { label: 'Yeni', variant: 'default', icon: Send },
  viewed: { label: 'Görüntülendi', variant: 'secondary', icon: Eye },
  answered: { label: 'Yanıtlandı', variant: 'default', icon: CheckCircle },
  completed: { label: 'Tamamlandı', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'İptal', variant: 'destructive', icon: Clock },
}

export default function VendorRequestsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [requests, setRequests] = useState<OrderRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      if (user?.role !== 'vendor') {
        router.push('/account')
        return
      }

      if (user?.vendorId) {
        const vendorRequests = getRequestsByVendorId(user.vendorId)
        setRequests(vendorRequests)
      }

      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  const columns: ColumnDef<OrderRequest>[] = [
    {
      accessorKey: 'id',
      header: 'Talep No',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'guestInfo.companyName',
      header: 'Müşteri',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.guestInfo.companyName}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.guestInfo.contactName}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'items',
      header: 'Ürün',
      cell: ({ row }) => {
        const vendorItems = row.original.items.filter(
          (item) => item.vendorId === user?.vendorId
        )
        return (
          <span className="text-sm">
            {vendorItems.length} ürün
          </span>
        )
      },
    },
    {
      accessorKey: 'totalEstimate',
      header: 'Tutar',
      cell: ({ row }) => (
        <span className="text-sm">
          {formatCurrency(row.original.totalEstimate.min)} -{' '}
          {formatCurrency(row.original.totalEstimate.max)}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Tarih',
      cell: ({ row }) => (
        <span className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString('tr-TR')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => {
        const request = row.original
        const hasVendorResponse = request.vendorResponses?.some(
          (r) => r.vendorId === user?.vendorId
        )

        if (hasVendorResponse) {
          return (
            <Badge variant="default">
              <CheckCircle className="mr-1 h-3 w-3" />
              Yanıtlandı
            </Badge>
          )
        }

        const status = statusConfig[request.status]
        const StatusIcon = status.icon
        return (
          <Badge variant={status.variant}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const request = row.original
        const hasVendorResponse = request.vendorResponses?.some(
          (r) => r.vendorId === user?.vendorId
        )

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/vendor/requests/${request.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Detay
                </Link>
              </DropdownMenuItem>
              {!hasVendorResponse && (
                <DropdownMenuItem asChild>
                  <Link href={`/vendor/requests/${request.id}`}>
                    <Send className="mr-2 h-4 w-4" />
                    Yanıtla
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (authLoading || isLoading) {
    return (
      <VendorLayout title="Gelen Talepler">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </VendorLayout>
    )
  }

  return (
    <VendorLayout
      title="Gelen Talepler"
      description="Müşterilerden gelen teklif taleplerini görüntüleyin ve yanıtlayın"
    >
      {requests.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Henüz talep yok</h3>
          <p className="mt-2 text-muted-foreground">
            Müşterilerden gelen talepler burada görüntülenecek
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={requests}
          searchKey="guestInfo.companyName"
          searchPlaceholder="Müşteri ara..."
        />
      )}
    </VendorLayout>
  )
}
