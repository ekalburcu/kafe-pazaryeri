'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useAuth } from '@/context/auth-context'
import { getAllVendors, updateVendorStatus } from '@/lib/data/vendors'
import { Vendor, VendorStatus } from '@/types'
import { toast } from 'sonner'

const statusConfig: Record<
  VendorStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: typeof Clock }
> = {
  pending: { label: 'Beklemede', variant: 'secondary', icon: Clock },
  approved: { label: 'Onaylı', variant: 'default', icon: CheckCircle },
  suspended: { label: 'Askıda', variant: 'destructive', icon: XCircle },
}

export default function AdminVendorsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadVendors = () => {
    const allVendors = getAllVendors()
    setVendors(allVendors)
  }

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

      loadVendors()
      setIsLoading(false)
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleStatusChange = (vendorId: string, status: VendorStatus) => {
    const updated = updateVendorStatus(vendorId, status)
    if (updated) {
      toast.success(
        status === 'approved'
          ? 'Tedarikçi onaylandı'
          : status === 'suspended'
            ? 'Tedarikçi askıya alındı'
            : 'Durum güncellendi'
      )
      loadVendors()
    } else {
      toast.error('İşlem başarısız')
    }
  }

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: 'name',
      header: 'Tedarikçi',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.city}</p>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Açıklama',
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground max-w-[200px] truncate">
          {row.original.description || '-'}
        </p>
      ),
    },
    {
      accessorKey: 'productCount',
      header: 'Ürün Sayısı',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.productCount || 0}</span>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Puan',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.rating ? `${row.original.rating}/5` : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'verified',
      header: 'Doğrulanmış',
      cell: ({ row }) => (
        <Badge variant={row.original.verified ? 'default' : 'outline'}>
          {row.original.verified ? 'Evet' : 'Hayır'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => {
        const status = row.original.status || 'pending'
        const config = statusConfig[status]
        const StatusIcon = config.icon
        return (
          <Badge variant={config.variant}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const vendor = row.original
        const status = vendor.status || 'pending'

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={`/vendors`} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  Görüntüle
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {status !== 'approved' && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(vendor.id, 'approved')}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Onayla
                </DropdownMenuItem>
              )}
              {status !== 'suspended' && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(vendor.id, 'suspended')}
                  className="text-destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Askıya Al
                </DropdownMenuItem>
              )}
              {status !== 'pending' && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(vendor.id, 'pending')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Beklemeye Al
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
      <AdminLayout title="Tedarikçiler">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Tedarikçiler"
      description="Platform tedarikçilerini yönetin, onaylayın veya askıya alın"
    >
      <DataTable
        columns={columns}
        data={vendors}
        searchKey="name"
        searchPlaceholder="Tedarikçi ara..."
      />
    </AdminLayout>
  )
}
