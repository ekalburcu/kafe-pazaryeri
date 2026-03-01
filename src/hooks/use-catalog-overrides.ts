'use client'

import { useEffect, useState } from 'react'
import { supabase, supabaseEnabled } from '@/lib/supabase'
import { CatalogOverrides } from '@/lib/data/products'
import { Product } from '@/types'

const empty: CatalogOverrides = { moderation: {}, adminProducts: [] }

export function useCatalogOverrides(): CatalogOverrides {
  const [overrides, setOverrides] = useState<CatalogOverrides>(empty)

  useEffect(() => {
    if (!supabaseEnabled) return

    async function fetch() {
      const [moderationRes, adminRes] = await Promise.all([
        supabase
          .from('product_overrides')
          .select('id, is_active'),
        supabase
          .from('admin_products')
          .select('data')
          .order('created_at', { ascending: true }),
      ])

      const moderation: Record<string, { isActive: boolean }> = {}
      for (const row of moderationRes.data ?? []) {
        moderation[row.id] = { isActive: row.is_active }
      }

      const adminProducts = (adminRes.data ?? []).map(
        (row) => row.data as Product
      )

      setOverrides({ moderation, adminProducts })
    }

    fetch()
  }, [])

  return overrides
}
