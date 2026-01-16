'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import {
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAuth } from '@/context/auth-context'
import { getAllRequests } from '@/lib/data/requests'
import { OrderRequest, RequestStatus } from '@/types'
import { formatCurrency } from '@/lib/utils'

const statusConfig: Record<
  RequestStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }
> = {
  draft: { label: 'Taslak', variant: 'outline', icon: Clock },
  sent: { label: 'Gönderildi', variant: 'default', icon: Send },
  viewed: { label: 'Görüntülendi', variant: 'secondary', icon: Eye },
  answered: { label: 'Yanıtlandı', variant: 'default', icon: CheckCircle },
  completed: { label: 'Tamamlandı', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'İptal', variant: 'destructive', icon: XCircle },
}

export default function AdminRequestsPage() {
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

      if (user?.role !== 'admin') {
        router.push('/account')
        return
      }

      const allRequests = getAllRequests()
      setRequests(allRequests)
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
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.items.length} ürün</span>
        </div>
      ),
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
      accessorKey: 'deliveryInfo.city',
      header: 'Şehir',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.deliveryInfo.city}</span>
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
        const status = statusConfig[row.original.status]
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
      accessorKey: 'vendorResponses',
      header: 'Yanıtlar',
      cell: ({ row }) => {
        const responses = row.original.vendorResponses || []
        return (
          <span className="text-sm">
            {responses.length > 0 ? `${responses.length} yanıt` : '-'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/requests/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ]

  if (authLoading || isLoading) {
    return (
      <AdminLayout title="Talepler">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Talepler"
      description="Platform üzerindeki tüm teklif taleplerini görüntüleyin"
    >
      <DataTable
        columns={columns}
        data={requests}
        searchKey="guestInfo.companyName"
        searchPlaceholder="Müşteri ara..."
      />
    </AdminLayout>
  )
}
